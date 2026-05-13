<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\DevelopmentPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class AiAssistantController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string|max:500', 'child_id' => 'nullable|integer']);

        $parentId = auth()->id();
        $context  = $this->buildContext($parentId, $request->child_id);
        $reply    = $this->askGemini($request->message, $context);

        return response()->json(['reply' => $reply]);
    }

    private function buildContext(int $parentId, ?int $childId): string
    {
        $children = Child::where('guardian_id', $parentId)->get();

        if ($children->isEmpty()) {
            return "This parent has no registered children yet.";
        }

        $lines = ["You are KidCare AI, a helpful child development assistant for parents at KidCare Hinoba-an Daycare Center."];
        $lines[] = "Always respond in a warm, supportive, and easy-to-understand tone.";
        $lines[] = "Base your answers on the child data provided below. Give specific, actionable advice.";
        $lines[] = "For predictive analytics, analyze trends in the data and flag risks early.";
        $lines[] = "Today's date: " . now()->format('F j, Y') . "\n";

        $targets = $childId
            ? $children->where('id', $childId)
            : $children;

        foreach ($targets as $child) {
            $lines[] = "=== CHILD: {$child->first_name} {$child->last_name} ===";
            $lines[] = "Age: {$child->age} years old | Sex: {$child->sex} | Status: {$child->registration_status}";
            $lines[] = "Classroom: " . ($child->classroom ?? 'Not assigned');
            $lines[] = "Birthdate: " . ($child->birthdate ? $child->birthdate->format('F j, Y') : 'N/A');

            // Growth history
            $growth = DB::table('nutrition_records')
                ->where('child_id', $child->id)
                ->whereNotNull('assessment_date')
                ->orderBy('assessment_date', 'asc')
                ->get(['assessment_date', 'height_first', 'weight_first', 'nutritional_status_result']);

            if ($growth->isNotEmpty()) {
                $lines[] = "\nGROWTH HISTORY:";
                foreach ($growth as $g) {
                    $lines[] = "  - {$g->assessment_date}: Height {$g->height_first}cm, Weight {$g->weight_first}kg, Status: {$g->nutritional_status_result}";
                }
                $latest = $growth->last();
                $first  = $growth->first();
                if ($growth->count() > 1) {
                    $hDiff = round($latest->height_first - $first->height_first, 1);
                    $wDiff = round($latest->weight_first - $first->weight_first, 1);
                    $lines[] = "Growth trend: Height changed by {$hDiff}cm, Weight changed by {$wDiff}kg since first record.";
                }
            } else {
                $lines[] = "\nGROWTH HISTORY: No records yet.";
            }

            // Observations
            $obs = DB::table('child_observations')
                ->where('child_id', $child->id)
                ->orderBy('created_at', 'asc')
                ->get(['behavior_name', 'observation_count', 'comment', 'created_at']);

            if ($obs->isNotEmpty()) {
                $lines[] = "\nBEHAVIORAL OBSERVATIONS:";
                foreach ($obs as $o) {
                    $date = \Carbon\Carbon::parse($o->created_at)->format('M j, Y');
                    $lines[] = "  - [{$date}] {$o->behavior_name}: {$o->observation_count} observation" . ($o->comment ? " — {$o->comment}" : '');
                }
            } else {
                $lines[] = "\nBEHAVIORAL OBSERVATIONS: No records yet.";
            }

            // Development plans
            $plans = DevelopmentPlan::where('child_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->get(['plan_type', 'status', 'goals', 'activities', 'target_date', 'progress_notes']);

            if ($plans->isNotEmpty()) {
                $lines[] = "\nDEVELOPMENT PLANS:";
                foreach ($plans as $p) {
                    $lines[] = "  - [{$p->status}] {$p->plan_type}: Goal: {$p->goals}";
                    if ($p->progress_notes) $lines[] = "    Progress: {$p->progress_notes}";
                    if ($p->target_date)    $lines[] = "    Target date: {$p->target_date}";
                }
            } else {
                $lines[] = "\nDEVELOPMENT PLANS: None assigned yet.";
            }

            // Appointments
            $apts = DB::table('checkup_appointments')
                ->where('child_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(['appointment_type', 'status', 'scheduled_date', 'scheduled_time']);

            if ($apts->isNotEmpty()) {
                $lines[] = "\nAPPOINTMENTS:";
                foreach ($apts as $a) {
                    $when = $a->scheduled_date ? "{$a->scheduled_date} {$a->scheduled_time}" : 'Not scheduled yet';
                    $lines[] = "  - [{$a->status}] {$a->appointment_type} — {$when}";
                }
            }

            $lines[] = "";
        }

        return implode("\n", $lines);
    }

    private function askGemini(string $message, string $context): string
    {
        $apiKey = env('GEMINI_API_KEY') ?: config('services.gemini.key');

        if (!$apiKey) {
            return "AI assistant is not configured yet. Please contact the administrator.";
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . urlencode($apiKey);

        $prompt = "{$context}\n\nParent's question: {$message}\n\nPlease provide a helpful, specific answer based on the child data above. If you detect any health or development concerns, mention them clearly but gently.";

        $response = Http::timeout(30)
            ->withHeaders(['x-goog-api-key' => $apiKey])
            ->post($url, [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'temperature'     => 0.7,
                'maxOutputTokens' => 600,
            ],
        ]);

        if ($response->failed()) {
            \Log::error('Gemini API error', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
            $errorMsg = $response->json('error.message') ?? 'Unknown error (status '.$response->status().')';
            return "AI error: {$errorMsg}";
        }

        return $response->json('candidates.0.content.parts.0.text')
            ?? "I couldn't generate a response. Please try again.";
    }
}
