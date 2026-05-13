<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1e293b; background: #fff; }

    .header { background: linear-gradient(135deg, #0ea5e9, #14b8a6); color: white; padding: 20px 24px; margin-bottom: 20px; }
    .header h1 { font-size: 18px; font-weight: bold; margin-bottom: 2px; }
    .header p { font-size: 10px; opacity: 0.85; }
    .header .meta { margin-top: 8px; font-size: 10px; opacity: 0.9; }

    .child-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin: 0 24px 18px; display: flex; gap: 20px; }
    .child-card .name { font-size: 16px; font-weight: bold; color: #0f766e; }
    .child-card .sub { font-size: 10px; color: #475569; margin-top: 2px; }
    .child-card .badge { display: inline-block; background: #14b8a6; color: white; font-size: 9px; font-weight: bold; padding: 2px 8px; border-radius: 20px; margin-top: 4px; }

    .section { margin: 0 24px 18px; }
    .section-title { font-size: 11px; font-weight: bold; color: #0ea5e9; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #e0f2fe; padding-bottom: 4px; margin-bottom: 10px; }

    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #f1f5f9; color: #475569; font-weight: bold; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; padding: 6px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tr:last-child td { border-bottom: none; }
    tr:nth-child(even) td { background: #f8fafc; }

    .badge-normal   { background: #dcfce7; color: #166534; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-under    { background: #fef9c3; color: #854d0e; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-severe   { background: #fee2e2; color: #991b1b; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-over     { background: #ffedd5; color: #9a3412; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-done     { background: #dcfce7; color: #166534; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-progress { background: #dbeafe; color: #1e40af; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-pending  { background: #fef9c3; color: #854d0e; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-sched    { background: #dbeafe; color: #1e40af; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .badge-comp     { background: #dcfce7; color: #166534; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }

    .summary-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 18px; }
    .summary-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 12px; text-align: center; }
    .summary-box .val { font-size: 20px; font-weight: bold; color: #0ea5e9; }
    .summary-box .lbl { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

    .empty { color: #94a3b8; font-style: italic; font-size: 10px; padding: 8px 0; }

    .footer { margin-top: 24px; padding: 12px 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }

    .obs-count { display: inline-block; padding: 2px 7px; border-radius: 20px; font-size: 9px; font-weight: bold; }
    .obs-1st { background: #dbeafe; color: #1e40af; }
    .obs-2nd { background: #ede9fe; color: #5b21b6; }
    .obs-3rd { background: #fef9c3; color: #854d0e; }
    .obs-4th { background: #dcfce7; color: #166534; }
</style>
</head>
<body>

{{-- Header --}}
<div class="header">
    <h1>{{ $barangay['system_name'] ?? 'KidCare Hinoba-an' }} — Child Progress Report</h1>
    <p>{{ $barangay['barangay_name'] ?? 'Barangay 2' }}, {{ $barangay['city'] ?? 'Hinoba-an' }}, {{ $barangay['province'] ?? 'Negros Occidental' }}</p>
    <div class="meta">Generated: {{ now()->format('F j, Y \a\t g:i A') }} &nbsp;|&nbsp; Prepared for: {{ auth()->user()->name }}</div>
</div>

{{-- Child Info --}}
<div class="child-card">
    <div style="flex:1">
        <div class="name">{{ $child->first_name }} {{ $child->middle_name }} {{ $child->last_name }}</div>
        <div class="sub">{{ $child->age }} years old &nbsp;•&nbsp; {{ $child->sex }} &nbsp;•&nbsp; Born: {{ $child->birthdate?->format('F j, Y') }}</div>
        <div class="sub" style="margin-top:3px">Classroom: {{ $child->classroom ?? 'Not assigned' }}</div>
        <span class="badge">{{ $child->registration_status }}</span>
    </div>
    <div style="text-align:right">
        @if($growth->isNotEmpty())
        <div style="font-size:13px;font-weight:bold;color:#0f766e">{{ $growth->last()->height_first }} cm</div>
        <div style="font-size:9px;color:#475569">Latest Height</div>
        <div style="font-size:13px;font-weight:bold;color:#0f766e;margin-top:4px">{{ $growth->last()->weight_first }} kg</div>
        <div style="font-size:9px;color:#475569">Latest Weight</div>
        @endif
    </div>
</div>

{{-- Summary --}}
<div class="section">
    <div class="section-title">📊 Summary Overview</div>
    <div class="summary-grid">
        <div class="summary-box">
            <div class="val">{{ $growth->count() }}</div>
            <div class="lbl">Growth Records</div>
        </div>
        <div class="summary-box">
            <div class="val">{{ $plans->count() }}</div>
            <div class="lbl">Dev. Plans</div>
        </div>
        <div class="summary-box">
            <div class="val">{{ $observations->count() }}</div>
            <div class="lbl">Observations</div>
        </div>
    </div>
</div>

{{-- Growth History --}}
<div class="section">
    <div class="section-title">📏 Growth History</div>
    @if($growth->isEmpty())
        <p class="empty">No growth records recorded yet.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Height (cm)</th>
                    <th>Weight (kg)</th>
                    <th>Nutritional Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach($growth as $g)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($g->assessment_date)->format('M j, Y') }}</td>
                    <td><strong>{{ $g->height_first }}</strong></td>
                    <td><strong>{{ $g->weight_first }}</strong></td>
                    <td>
                        @php $sl = strtolower($g->nutritional_status_result ?? ''); @endphp
                        @if(str_contains($sl,'severely'))
                            <span class="badge-severe">{{ $g->nutritional_status_result }}</span>
                        @elseif(str_contains($sl,'underweight'))
                            <span class="badge-under">{{ $g->nutritional_status_result }}</span>
                        @elseif(str_contains($sl,'overweight'))
                            <span class="badge-over">{{ $g->nutritional_status_result }}</span>
                        @else
                            <span class="badge-normal">{{ $g->nutritional_status_result ?? 'Normal' }}</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @if($growth->count() > 1)
        @php
            $hDiff = round($growth->last()->height_first - $growth->first()->height_first, 1);
            $wDiff = round($growth->last()->weight_first - $growth->first()->weight_first, 1);
        @endphp
        <p style="margin-top:6px;font-size:10px;color:#475569">
            Growth trend: Height {{ $hDiff >= 0 ? '+' : '' }}{{ $hDiff }}cm &nbsp;|&nbsp; Weight {{ $wDiff >= 0 ? '+' : '' }}{{ $wDiff }}kg since first record.
        </p>
        @endif
    @endif
</div>

{{-- Development Plans --}}
<div class="section">
    <div class="section-title">📋 Development Plans</div>
    @if($plans->isEmpty())
        <p class="empty">No development plans assigned yet.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Plan Type</th>
                    <th>Status</th>
                    <th>Goals</th>
                    <th>Target Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($plans as $p)
                <tr>
                    <td style="text-transform:capitalize">{{ str_replace('_',' ',$p->plan_type) }}</td>
                    <td>
                        @if($p->status === 'completed') <span class="badge-done">Completed</span>
                        @elseif($p->status === 'in_progress') <span class="badge-progress">In Progress</span>
                        @else <span class="badge-pending">Pending</span>
                        @endif
                    </td>
                    <td>{{ $p->goals }}</td>
                    <td>{{ $p->target_date ? \Carbon\Carbon::parse($p->target_date)->format('M j, Y') : '—' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>

{{-- Behavioral Observations --}}
<div class="section">
    <div class="section-title">👁 Behavioral Observations</div>
    @if($observations->isEmpty())
        <p class="empty">No behavioral observations recorded yet.</p>
    @else
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Behavior</th>
                    <th>Observation</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                @foreach($observations as $o)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($o->created_at)->format('M j, Y') }}</td>
                    <td>{{ $o->behavior_name }}</td>
                    <td>
                        <span class="obs-count obs-{{ strtolower(str_replace(['st','nd','rd','th'],'',$o->observation_count)) }}{{ $o->observation_count }}">
                            {{ $o->observation_count }}
                        </span>
                    </td>
                    <td>{{ $o->comment ?? '—' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</div>

{{-- Appointments --}}
@if($appointments->isNotEmpty())
<div class="section">
    <div class="section-title">📅 Appointments</div>
    <table>
        <thead>
            <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Scheduled Date</th>
                <th>Time</th>
            </tr>
        </thead>
        <tbody>
            @foreach($appointments as $a)
            <tr>
                <td style="text-transform:capitalize">{{ str_replace('_',' ',$a->appointment_type) }}</td>
                <td>
                    @if($a->status === 'scheduled') <span class="badge-sched">Scheduled</span>
                    @elseif($a->status === 'completed') <span class="badge-comp">Completed</span>
                    @else <span class="badge-pending">{{ ucfirst($a->status) }}</span>
                    @endif
                </td>
                <td>{{ $a->scheduled_date ? \Carbon\Carbon::parse($a->scheduled_date)->format('M j, Y') : '—' }}</td>
                <td>{{ $a->scheduled_time ?? '—' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

{{-- Footer --}}
<div class="footer">
    <span>{{ $barangay['system_name'] ?? 'KidCare Hinoba-an' }} — Confidential Child Progress Report</span>
    <span>Generated on {{ now()->format('F j, Y') }}</span>
</div>

</body>
</html>
