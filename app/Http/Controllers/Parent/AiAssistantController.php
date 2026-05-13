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
        preg_match('/Sex: (\w+)/', $context, $sexMatch);
        preg_match('/Height changed by ([\-\d\.]+)cm, Weight changed by ([\-\d\.]+)kg/', $context, $trend);
        preg_match('/Classroom: ([^\n]+)/', $context, $classMatch);

        $height    = $latest[1] ?? null;
        $weight    = $latest[2] ?? null;
        $status    = trim($latest[3] ?? 'Not assessed');
        $name      = trim($nameMatch[1] ?? 'Your child');
        $age       = $ageMatch[1] ?? null;
        $sex       = $sexMatch[1] ?? null;
        $hChange   = isset($trend[1]) ? (float)$trend[1] : null;
        $wChange   = isset($trend[2]) ? (float)$trend[2] : null;
        $classroom = trim($classMatch[1] ?? 'Not assigned');
        $sl        = strtolower($status);
        $hasGrowth = $height && $weight;

        // ── HEALTH RISKS ─────────────────────────────────────────────────────
        if (str_contains($msg, 'health') || str_contains($msg, 'risk') || str_contains($msg, 'danger') || str_contains($msg, 'concern') || str_contains($msg, 'problem') || str_contains($msg, 'sick') || str_contains($msg, 'illness') || str_contains($msg, 'medical')) {
            $risks = [];
            $solutions = [];

            if (!$hasGrowth) {
                return "No health records found for {$name} yet. Please ask the daycare admin to record measurements so we can assess health risks.";
            }

            if (str_contains($sl, 'severely underweight')) {
                $risks[] = "🔴 **Severely Underweight** — This is a serious health risk.";
                $solutions[] = "• Schedule an **urgent nutrition assessment** with a health worker immediately";
                $solutions[] = "• Increase calorie-dense foods: eggs, peanut butter, avocado, full-fat dairy";
                $solutions[] = "• Give small frequent meals (5-6x a day) instead of 3 large meals";
                $solutions[] = "• Consider vitamin and mineral supplements (consult a doctor first)";
                $solutions[] = "• Monitor weight weekly";
            } elseif (str_contains($sl, 'underweight')) {
                $risks[] = "🟡 **Underweight** — Needs attention to prevent further decline.";
                $solutions[] = "• Add protein-rich foods: fish, chicken, eggs, beans, lentils";
                $solutions[] = "• Include healthy fats: coconut milk, nuts, avocado";
                $solutions[] = "• Ensure {$name} eats breakfast every day before school";
                $solutions[] = "• Schedule a nutrition checkup within the next 2 weeks";
                $solutions[] = "• Reduce sugary snacks and replace with nutritious ones";
            } elseif (str_contains($sl, 'overweight')) {
                $risks[] = "🟡 **Overweight** — Risk of childhood obesity if not addressed.";
                $solutions[] = "• Replace sugary drinks with water or fresh fruit juice";
                $solutions[] = "• Increase vegetables and fruits in every meal";
                $solutions[] = "• Encourage at least 60 minutes of active play daily";
                $solutions[] = "• Limit screen time to less than 2 hours per day";
                $solutions[] = "• Avoid fast food and processed snacks";
                $solutions[] = "• Schedule a checkup with a pediatrician";
            } else {
                $risks[] = "✅ **No major health risks detected** — {$name}'s nutritional status is **{$status}**.";
                $solutions[] = "• Continue balanced meals with rice, vegetables, protein, and fruits";
                $solutions[] = "• Maintain regular checkups every 3-6 months";
                $solutions[] = "• Ensure complete vaccinations are up to date";
                $solutions[] = "• Keep up regular physical activity and outdoor play";
            }

            if ($hChange !== null && $hChange < 0) {
                $risks[] = "🟡 **Height decreased** by " . abs($hChange) . "cm — unusual, may need medical attention.";
                $solutions[] = "• Consult a doctor about the height decrease — this is uncommon and should be checked";
            }
            if ($wChange !== null && $wChange < -1) {
                $risks[] = "🟡 **Weight dropped** by " . abs($wChange) . "kg since last record.";
                $solutions[] = "• Monitor food intake closely and schedule a nutrition assessment";
            }

            $result = "🏥 **Health Risk Assessment for {$name}**\n\n";
            $result .= implode("\n", $risks) . "\n\n";
            $result .= "**Recommended Actions:**\n" . implode("\n", $solutions);
            return $result;
        }

        // ── GROWTH ───────────────────────────────────────────────────────────
        if (str_contains($msg, 'grow') || str_contains($msg, 'height') || str_contains($msg, 'weight') || str_contains($msg, 'tall') || str_contains($msg, 'size') || str_contains($msg, 'measurement')) {
            if (!$hasGrowth) return "No growth records have been recorded yet for {$name}. Please ask the daycare admin to add measurements.";
            $trendText = '';
            if ($hChange !== null) $trendText .= $hChange >= 0 ? "📈 Height +{$hChange}cm" : "📉 Height {$hChange}cm ⚠️";
            if ($wChange !== null) $trendText .= ($trendText ? ', ' : '') . ($wChange >= 0 ? "Weight +{$wChange}kg ✅" : "Weight {$wChange}kg ⚠️");
            return "**{$name}'s latest measurements:**\nHeight: {$height}cm | Weight: {$weight}kg | Status: **{$status}**\n" .
                ($trendText ? "Trend: {$trendText}\n" : '') .
                ($status === 'Normal' ? "🎉 Nutritional status is normal — great job!" : "⚠️ Please consider scheduling a nutrition assessment soon.");
        }

        // ── NUTRITION / STATUS ───────────────────────────────────────────────
        if (str_contains($msg, 'nutrition') || str_contains($msg, 'nutritional') || str_contains($msg, 'status') || str_contains($msg, 'underweight') || str_contains($msg, 'overweight') || str_contains($msg, 'food') || str_contains($msg, 'eat') || str_contains($msg, 'diet') || str_contains($msg, 'meal')) {
            if (!$hasGrowth) return "No nutritional records found for {$name} yet.";
            if (str_contains($sl, 'severely underweight')) return "⚠️ **{$name} is severely underweight.**\n• Schedule an urgent nutrition assessment immediately\n• Give calorie-dense foods: eggs, peanut butter, avocado, full-fat milk\n• Feed small meals 5-6 times a day\n• Consult a health worker as soon as possible.";
            if (str_contains($sl, 'underweight')) return "⚠️ **{$name} is underweight.**\n• Add more protein: fish, chicken, eggs, beans\n• Include healthy fats in meals\n• Ensure breakfast is eaten daily\n• Schedule a nutrition checkup soon.";
            if (str_contains($sl, 'overweight')) return "⚠️ **{$name} is overweight.**\n• Replace sugary drinks with water\n• More vegetables and fruits in every meal\n• At least 60 minutes of active play daily\n• Limit screen time and processed snacks.";
            return "✅ **{$name}'s nutritional status is {$status}.**\n• Keep up balanced meals with rice, vegetables, protein, and fruits\n• Maintain regular checkups every 3-6 months\n• Great job keeping {$name} healthy! 🎉";
        }

        // ── APPOINTMENTS ─────────────────────────────────────────────────────
        if (str_contains($msg, 'appointment') || str_contains($msg, 'checkup') || str_contains($msg, 'check-up') || str_contains($msg, 'schedule') || str_contains($msg, 'visit') || str_contains($msg, 'doctor') || str_contains($msg, 'next')) {
            if (str_contains($context, '[scheduled]')) {
                preg_match('/\[scheduled\] ([\w ]+) — (\S+)/', $context, $apt);
                if ($apt) return "📅 **{$name} has an upcoming appointment:**\nType: {$apt[1]}\nDate: {$apt[2]}\n\nMake sure to attend on time! Bring any previous health records if available.";
            }
            if (str_contains($context, '[pending]')) {
                return "⏳ {$name} has a **pending appointment** waiting to be scheduled by the admin. You will be notified once it's confirmed.";
            }
            if (str_contains($context, '[completed]')) {
                return "✅ {$name}'s last appointment has been **completed**. You can request a new one from the Appointments section if needed.";
            }
            return "No upcoming appointments for {$name}. You can request one from the **Appointments** section in the menu.";
        }

        // ── DEVELOPMENT PLANS ────────────────────────────────────────────────
        if (str_contains($msg, 'development') || str_contains($msg, 'plan') || str_contains($msg, 'progress') || str_contains($msg, 'goal') || str_contains($msg, 'milestone') || str_contains($msg, 'target') || str_contains($msg, 'learning')) {
            if (str_contains($context, 'DEVELOPMENT PLANS:') && !str_contains($context, 'None assigned')) {
                preg_match_all('/\[(completed|in_progress|pending)\]/', $context, $pm);
                $done = count(array_filter($pm[1], fn($s) => $s === 'completed'));
                $ip   = count(array_filter($pm[1], fn($s) => $s === 'in_progress'));
                $pend = count(array_filter($pm[1], fn($s) => $s === 'pending'));
                $total = $done + $ip + $pend;
                $pct  = $total > 0 ? round(($done / $total) * 100) : 0;
                return "📋 **{$name}'s Development Plans ({$pct}% complete)**\n• ✅ Completed: {$done}\n• 🔄 In Progress: {$ip}\n• ⏳ Pending: {$pend}\n\n" .
                    ($ip > 0 ? "Keep supporting the ongoing activities at home!" : ($done === $total && $total > 0 ? "🎉 All plans completed! Ask the teacher about new goals." : "Ask the teacher about starting new development activities."));
            }
            return "No development plans assigned yet for {$name}. The daycare teacher will create personalized plans soon.";
        }

        // ── BEHAVIORAL OBSERVATIONS ──────────────────────────────────────────
        if (str_contains($msg, 'observation') || str_contains($msg, 'behavior') || str_contains($msg, 'behaviour') || str_contains($msg, 'conduct') || str_contains($msg, 'attitude') || str_contains($msg, 'social') || str_contains($msg, 'interact')) {
            if (str_contains($context, 'BEHAVIORAL OBSERVATIONS:') && !str_contains($context, 'No records yet')) {
                preg_match_all('/\d+(?:st|nd|rd|th) observation/', $context, $obsMatches);
                $count = count($obsMatches[0]);
                return "👁️ **{$name} has {$count} behavioral observation(s) recorded.**\n\nVisit the **Growth & Development** page to see the full milestone chart.\n\n💡 Tip: Consistent observations help track social, emotional, and cognitive progress over time.";
            }
            return "No behavioral observations recorded yet for {$name}. The daycare teacher will record these during class activities.";
        }

        // ── CLASSROOM / SCHOOL ───────────────────────────────────────────────
        if (str_contains($msg, 'class') || str_contains($msg, 'school') || str_contains($msg, 'teacher') || str_contains($msg, 'room') || str_contains($msg, 'enroll') || str_contains($msg, 'section')) {
            if ($classroom !== 'Not assigned') {
                return "🏫 **{$name} is enrolled in the {$classroom} class.**\n\nIf you have questions about classroom activities, you can message the teacher through the **Messages** section.";
            }
            return "{$name} has not been assigned to a classroom yet. Please wait for the admin to assign a class, or contact the daycare center.";
        }

        // ── AGE / BIRTHDAY ───────────────────────────────────────────────────
        if (str_contains($msg, 'age') || str_contains($msg, 'old') || str_contains($msg, 'birthday') || str_contains($msg, 'born') || str_contains($msg, 'birth')) {
            if ($age) {
                return "🎂 **{$name} is {$age} years old.**\n\nAt this age, children develop rapidly in language, motor skills, and social abilities. Make sure to:\n• Read and talk with {$name} daily\n• Encourage creative play\n• Maintain regular health checkups";
            }
            return "Age information is not available for {$name} yet.";
        }

        // ── VACCINATION / IMMUNIZATION ───────────────────────────────────────
        if (str_contains($msg, 'vaccin') || str_contains($msg, 'immuniz') || str_contains($msg, 'shot') || str_contains($msg, 'injection')) {
            return "💉 **Vaccination Reminder for {$name}:**\n\nEnsure {$name} has completed the following vaccines:\n• BCG (at birth)\n• Hepatitis B (3 doses)\n• DPT/Pentavalent (3 doses)\n• Oral Polio Vaccine (3 doses)\n• Measles/MMR (at 9 months and 12-15 months)\n\nCheck {$name}'s health records in the **Health** section for vaccination status. If any are missing, schedule a visit to the health center.";
        }

        // ── PREDICTIVE / FUTURE ──────────────────────────────────────────────
        if (str_contains($msg, 'predict') || str_contains($msg, 'future') || str_contains($msg, 'forecast') || str_contains($msg, 'will') || str_contains($msg, 'trend')) {
            if (!$hasGrowth) return "Not enough data to make predictions for {$name} yet. Growth records are needed first.";
            $prediction = "📊 **Growth Prediction for {$name}:**\n";
            if ($hChange !== null && $hChange > 0) {
                $projected = round((float)$height + $hChange, 1);
                $prediction .= "• At current rate, height may reach ~{$projected}cm in the next period\n";
            }
            if ($wChange !== null) {
                if ($wChange > 0) $prediction .= "• Weight is increasing steadily ✅\n";
                elseif ($wChange < 0) $prediction .= "• ⚠️ Weight is declining — monitor closely and consult a health worker\n";
                else $prediction .= "• Weight has been stable\n";
            }
            $prediction .= $status === 'Normal' ? "\n✅ Overall trend looks healthy. Keep up the good work!" : "\n⚠️ Current status needs attention. Please schedule a checkup.";
            return $prediction;
        }

        // ── TIPS / ADVICE / ACTIVITIES ───────────────────────────────────────
        if (str_contains($msg, 'tip') || str_contains($msg, 'advice') || str_contains($msg, 'activit') || str_contains($msg, 'suggest') || str_contains($msg, 'recommend') || str_contains($msg, 'improve') || str_contains($msg, 'support') || str_contains($msg, 'help')) {
            return "💡 **Tips to support {$name}'s development:**\n\n🧠 **Cognitive:**\n• Read together daily — even 10 minutes helps\n• Play counting and sorting games\n• Ask open-ended questions about their day\n\n🏃 **Physical:**\n• At least 60 minutes of active outdoor play daily\n• Limit screen time to under 2 hours\n• Ensure 10-13 hours of sleep per night\n\n❤️ **Social & Emotional:**\n• Praise effort, not just results\n• Teach sharing and taking turns\n• Create a consistent daily routine\n\n🍽️ **Nutrition:**\n• Balanced meals: rice/carbs, protein, vegetables, fruits\n• Healthy snacks: fruits, boiled eggs, yogurt\n• Drink plenty of water throughout the day";
        }

        // ── REPORT / SUMMARY ─────────────────────────────────────────────────
        if (str_contains($msg, 'report') || str_contains($msg, 'summary') || str_contains($msg, 'overall') || str_contains($msg, 'everything') || str_contains($msg, 'all') || str_contains($msg, 'update')) {
            $parts = ["📊 **Full Report for {$name}**\n"];
            if ($age && $sex)  $parts[] = "👤 Age: {$age} yrs | Sex: {$sex} | Class: {$classroom}";
            if ($hasGrowth)    $parts[] = "📏 Height: {$height}cm | Weight: {$weight}kg | Status: **{$status}**";
            if ($hChange !== null) $parts[] = "📈 Growth: Height " . ($hChange >= 0 ? "+" : "") . "{$hChange}cm, Weight " . ($wChange >= 0 ? "+" : "") . "{$wChange}kg";
            if (str_contains($context, 'DEVELOPMENT PLANS:') && !str_contains($context, 'None assigned')) {
                preg_match_all('/\[(completed|in_progress|pending)\]/', $context, $pm);
                $done = count(array_filter($pm[1], fn($s) => $s === 'completed'));
                $ip   = count(array_filter($pm[1], fn($s) => $s === 'in_progress'));
                $parts[] = "📋 Plans: {$done} completed, {$ip} in progress";
            }
            if (str_contains($context, 'BEHAVIORAL OBSERVATIONS:') && !str_contains($context, 'No records yet')) $parts[] = "👁️ Behavioral observations: recorded ✅";
            if (str_contains($context, '[scheduled]')) $parts[] = "📅 Has upcoming appointment ✅";
            $parts[] = "\n" . ($status === 'Normal' || !$hasGrowth ? "✅ Overall: {$name} is doing well! Keep it up!" : "⚠️ Attention needed: Please monitor {$name}'s health and schedule a checkup.");
            return implode("\n", $parts);
        }

        // ── GREETING ─────────────────────────────────────────────────────────
        if (str_contains($msg, 'hello') || str_contains($msg, 'hi') || str_contains($msg, 'hey') || str_contains($msg, 'good morning') || str_contains($msg, 'good evening') || $msg === 'hi' || $msg === 'hello') {
            return "Hello! 👋 I'm KidCare AI, your child development assistant.\n\nI can help you with **{$name}'s**:\n• 📏 Growth & measurements\n• 🍽️ Nutritional status\n• 🏥 Health risks & solutions\n• 📋 Development plans\n• 📅 Appointments\n• 💡 Parenting tips\n\nWhat would you like to know?";
        }

        // ── DEFAULT ──────────────────────────────────────────────────────────
        return "Hi! I can help you with **{$name}'s** health and development. Try asking:\n• \"Are there any health risks?\"\n• \"How is my child growing?\"\n• \"What is the nutritional status?\"\n• \"Give me a progress report\"\n• \"Any development tips?\"\n• \"When is the next appointment?\"\n• \"What are the development plans?\"";
    }
}
