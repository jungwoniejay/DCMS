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

        $lines   = [];
        $targets = $childId ? $children->where('id', $childId) : $children;

        foreach ($targets as $child) {
            $lines[] = "=== CHILD: {$child->first_name} {$child->last_name} ===";
            $lines[] = "Age: {$child->age} years old | Sex: {$child->sex} | Status: {$child->registration_status}";
            $lines[] = "Classroom: " . ($child->classroom ?? 'Not assigned');

            $growth = DB::table('nutrition_records')
                ->where('child_id', $child->id)
                ->whereNotNull('assessment_date')
                ->orderBy('assessment_date', 'asc')
                ->get(['assessment_date', 'height_first', 'weight_first', 'nutritional_status_result']);

            if ($growth->isNotEmpty()) {
                $lines[] = "GROWTH HISTORY:";
                foreach ($growth as $g) {
                    $lines[] = "  - {$g->assessment_date}: Height {$g->height_first}cm, Weight {$g->weight_first}kg, Status: {$g->nutritional_status_result}";
                }
                if ($growth->count() > 1) {
                    $hDiff = round($growth->last()->height_first - $growth->first()->height_first, 1);
                    $wDiff = round($growth->last()->weight_first - $growth->first()->weight_first, 1);
                    $lines[] = "Growth trend: Height changed by {$hDiff}cm, Weight changed by {$wDiff}kg since first record.";
                }
            } else {
                $lines[] = "GROWTH HISTORY: No records yet.";
            }

            $obs = DB::table('child_observations')
                ->where('child_id', $child->id)
                ->orderBy('created_at', 'asc')
                ->get(['behavior_name', 'observation_count', 'comment', 'created_at']);

            if ($obs->isNotEmpty()) {
                $lines[] = "BEHAVIORAL OBSERVATIONS:";
                foreach ($obs as $o) {
                    $date    = \Carbon\Carbon::parse($o->created_at)->format('M j, Y');
                    $lines[] = "  - [{$date}] {$o->behavior_name}: {$o->observation_count}" . ($o->comment ? " — {$o->comment}" : '');
                }
            } else {
                $lines[] = "BEHAVIORAL OBSERVATIONS: No records yet.";
            }

            $plans = DevelopmentPlan::where('child_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->get(['plan_type', 'status', 'goals', 'activities', 'target_date', 'progress_notes']);

            if ($plans->isNotEmpty()) {
                $lines[] = "DEVELOPMENT PLANS:";
                foreach ($plans as $p) {
                    $lines[] = "  - [{$p->status}] {$p->plan_type}: Goal: {$p->goals}";
                    if ($p->progress_notes) $lines[] = "    Progress: {$p->progress_notes}";
                    if ($p->target_date)    $lines[] = "    Target date: {$p->target_date}";
                }
            } else {
                $lines[] = "DEVELOPMENT PLANS: None assigned yet.";
            }

            $apts = DB::table('checkup_appointments')
                ->where('child_id', $child->id)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get(['appointment_type', 'status', 'scheduled_date', 'scheduled_time']);

            if ($apts->isNotEmpty()) {
                $lines[] = "APPOINTMENTS:";
                foreach ($apts as $a) {
                    $when    = $a->scheduled_date ? "{$a->scheduled_date} {$a->scheduled_time}" : 'Not scheduled yet';
                    $lines[] = "  - [{$a->status}] {$a->appointment_type} — {$when}";
                }
            }

            $lines[] = "";
        }

        return implode("\n", $lines);
    }

    private function askGemini(string $message, string $context): string
    {
        $apiKey = config('services.gemini.key')
            ?? $_ENV['GEMINI_API_KEY']
            ?? getenv('GEMINI_API_KEY')
            ?? env('GEMINI_API_KEY');

        if ($apiKey) {
            $url    = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=" . urlencode($apiKey);
            $prompt = "You are KidCare AI, a warm and helpful child development assistant.\n\nChild data:\n{$context}\n\nParent's question: {$message}\n\nGive a specific, helpful answer based on the data. Be warm and supportive.";

            $response = Http::timeout(20)
                ->withHeaders(['x-goog-api-key' => $apiKey])
                ->post($url, [
                    'contents'         => [['parts' => [['text' => $prompt]]]],
                    'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 500],
                ]);

            $error = $response->json('error.code');

            if (!$response->failed() && !$error) {
                $text = $response->json('candidates.0.content.parts.0.text');
                if ($text) return $text;
            }
        }

        // Fallback: rule-based response
        return $this->ruleBasedResponse($message, $context);
    }

    private function ruleBasedResponse(string $message, string $context): string
    {
        $msg = strtolower($message);

        preg_match('/Height ([\d\.]+)cm, Weight ([\d\.]+)kg, Status: (\w[\w ]*)\n/', $context, $latest);
        preg_match('/CHILD: ([^\n=]+)/', $context, $nameMatch);
        preg_match('/Age: (\d+) years/', $context, $ageMatch);
        preg_match('/Height changed by ([\-\d\.]+)cm, Weight changed by ([\-\d\.]+)kg/', $context, $trend);

        $height  = $latest[1] ?? null;
        $weight  = $latest[2] ?? null;
        $status  = trim($latest[3] ?? 'Not assessed');
        $name    = trim($nameMatch[1] ?? 'Your child');
        $age     = $ageMatch[1] ?? null;
        $hChange = isset($trend[1]) ? (float)$trend[1] : null;
        $wChange = isset($trend[2]) ? (float)$trend[2] : null;

        if (str_contains($msg, 'grow') || str_contains($msg, 'height') || str_contains($msg, 'weight') || str_contains($msg, 'tall')) {
            if (!$height) return "No growth records have been recorded yet for {$name}. Please ask the daycare admin to add measurements.";
            $trendText = '';
            if ($hChange !== null) $trendText .= $hChange >= 0 ? "📈 Height +{$hChange}cm" : "📉 Height {$hChange}cm ⚠️";
            if ($wChange !== null) $trendText .= ($trendText ? ', ' : '') . ($wChange >= 0 ? "Weight +{$wChange}kg ✅" : "Weight {$wChange}kg ⚠️");
            return "**{$name}'s latest:** Height {$height}cm, Weight {$weight}kg, Status: **{$status}**.\n" .
                ($trendText ? "Trend: {$trendText}\n" : '') .
                ($status === 'Normal' ? "🎉 Nutritional status is normal — great job!" : "⚠️ Please consider scheduling a nutrition assessment soon.");
        }

        if (str_contains($msg, 'nutrition') || str_contains($msg, 'status') || str_contains($msg, 'underweight') || str_contains($msg, 'overweight')) {
            if (!$height) return "No nutritional records found for {$name} yet.";
            $sl = strtolower($status);
            if (str_contains($sl, 'severely')) return "⚠️ **{$name} is severely underweight.** Please schedule an urgent nutrition assessment and consult a health worker immediately.";
            if (str_contains($sl, 'underweight')) return "⚠️ **{$name} is underweight.** Increase protein and calorie intake — eggs, fish, beans, and dairy are great options. Schedule a checkup soon.";
            if (str_contains($sl, 'overweight')) return "⚠️ **{$name} is overweight.** Focus on balanced meals with more vegetables and fruits, and encourage active play.";
            return "✅ **{$name}'s nutritional status is {$status}.** Keep up the good work with balanced meals!";
        }

        if (str_contains($msg, 'appointment') || str_contains($msg, 'checkup') || str_contains($msg, 'schedule')) {
            if (str_contains($context, '[scheduled]')) {
                preg_match('/\[scheduled\] (\w[\w_]*) — (\S+)/', $context, $apt);
                if ($apt) return "📅 {$name} has a scheduled **{$apt[1]}** appointment on **{$apt[2]}**.";
            }
            return "No upcoming scheduled appointments for {$name}. You can request one from the Appointments section.";
        }

        if (str_contains($msg, 'development') || str_contains($msg, 'plan') || str_contains($msg, 'progress')) {
            if (str_contains($context, 'DEVELOPMENT PLANS:') && !str_contains($context, 'None assigned')) {
                preg_match_all('/\[(completed|in_progress|pending)\]/', $context, $pm);
                $done = count(array_filter($pm[1], fn($s) => $s === 'completed'));
                $ip   = count(array_filter($pm[1], fn($s) => $s === 'in_progress'));
                $pend = count(array_filter($pm[1], fn($s) => $s === 'pending'));
                return "📋 **{$name}'s development plans:** {$done} completed ✅, {$ip} in progress 🔄, {$pend} pending ⏳.\n" .
                    ($ip > 0 ? "Keep supporting the ongoing activities!" : "Ask the teacher about starting new development activities.");
            }
            return "No development plans assigned yet for {$name}. The daycare teacher will create plans soon.";
        }

        if (str_contains($msg, 'observation') || str_contains($msg, 'behavior')) {
            if (str_contains($context, 'BEHAVIORAL OBSERVATIONS:') && !str_contains($context, 'No records yet')) {
                return "Behavioral observations have been recorded for {$name}. Visit the **Growth & Development** page to see the detailed milestone chart showing progress over time.";
            }
            return "No behavioral observations recorded yet for {$name}.";
        }

        if (str_contains($msg, 'report') || str_contains($msg, 'summary') || str_contains($msg, 'overall')) {
            $parts = ["📊 **Summary for {$name}**"];
            if ($age)    $parts[] = "• Age: {$age} years old";
            if ($height) $parts[] = "• Height: {$height}cm | Weight: {$weight}kg | Status: {$status}";
            if (str_contains($context, 'DEVELOPMENT PLANS:') && !str_contains($context, 'None assigned')) $parts[] = "• Has development plans assigned ✅";
            if (str_contains($context, 'BEHAVIORAL OBSERVATIONS:') && !str_contains($context, 'No records yet')) $parts[] = "• Has behavioral observations recorded ✅";
            $parts[] = $status === 'Normal' ? "\n✅ Overall: {$name} is doing well!" : "\n⚠️ Please monitor {$name}'s nutritional status closely.";
            return implode("\n", $parts);
        }

        if (str_contains($msg, 'tip') || str_contains($msg, 'advice') || str_contains($msg, 'activit') || str_contains($msg, 'help')) {
            return "Here are some tips to support {$name}'s development:\n• Read together daily — even 10 minutes helps language skills\n• Encourage outdoor play for physical development\n• Praise effort, not just results\n• Maintain consistent meal and sleep schedules\n• Talk to your child about their day to build communication skills";
        }

        return "Hi! I can help you with **{$name}'s** growth, nutrition status, development plans, appointments, and behavioral observations. Try asking:\n• \"How is my child growing?\"\n• \"What is the nutritional status?\"\n• \"Give me a progress report\"\n• \"Any development tips?\"";
    }
}
