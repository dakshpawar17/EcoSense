import Groq from "groq-sdk";

export interface Recommendation {
  title: string;
  description: string;
  impact_saved: number;
}

export interface EcoReportResponse {
  summary: string;
  score: number;
  grade: string;
  biggest_contributor: string;
  comparison: string;
  recommendations: Recommendation[];
}

export interface FootprintSummary {
  co2Transport: number;
  co2Energy: number;
  co2Food: number;
  co2Shopping: number;
  co2Total: number;
  ecoScore: number;
  grade: string;
  averageComparison: string;
}

export async function generateClaudeReport(summary: FootprintSummary): Promise<EcoReportResponse> {
  return generateGroqReport(summary);
}

export async function generateGroqReport(summary: FootprintSummary): Promise<EcoReportResponse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey });
      const promptText = `
You are EcoSense.
You are a friendly sustainability coach.
Analyze this user's carbon footprint:
- Transport CO2: ${summary.co2Transport} kg
- Energy CO2: ${summary.co2Energy} kg
- Food CO2: ${summary.co2Food} kg
- Shopping CO2: ${summary.co2Shopping} kg
- Total CO2: ${summary.co2Total} kg
- EcoScore: ${summary.ecoScore} (${summary.grade})
- National Average Comparison: ${summary.averageComparison}

Return ONLY valid JSON.

{
  "summary": "Brief 2-sentence breakdown of user carbon impact",
  "score": ${summary.ecoScore},
  "grade": "${summary.grade}",
  "biggest_contributor": "Name of biggest sector (e.g. Transport)",
  "comparison": "Brief comparison with the national daily average of 12.5 kg",
  "recommendations": [
    {
      "title": "Short title 1",
      "description": "Specific actionable advice",
      "impact_saved": 1.5
    },
    {
      "title": "Short title 2",
      "description": "Specific actionable advice",
      "impact_saved": 0.8
    },
    {
      "title": "Short title 3",
      "description": "Specific actionable advice",
      "impact_saved": 1.2
    },
    {
      "title": "Short title 4",
      "description": "Specific actionable advice",
      "impact_saved": 0.5
    }
  ]
}
      `.trim();

      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are EcoSense, an expert AI sustainability coach. You must output valid JSON ONLY." },
          { role: "user", content: promptText }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const rawText = response.choices[0]?.message?.content || "";
      const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

      const parsed: EcoReportResponse = JSON.parse(cleanedJson);
      if (
        parsed &&
        parsed.summary &&
        Array.isArray(parsed.recommendations) &&
        parsed.recommendations.length > 0
      ) {
        return parsed;
      }
    } catch (error) {
      console.warn("Groq API call failed or returned non-JSON, using intelligent fallback engine:", error);
    }
  }

  // Fallback engine if API key is missing or request fails
  return generateFallbackReport(summary);
}

export function generateFallbackReport(summary: FootprintSummary): EcoReportResponse {
  const breakdown = [
    { name: "Transport", val: summary.co2Transport },
    { name: "Energy", val: summary.co2Energy },
    { name: "Food", val: summary.co2Food },
    { name: "Shopping", val: summary.co2Shopping },
  ].sort((a, b) => b.val - a.val);

  const biggest = breakdown[0].name;
  const isBelowAverage = summary.co2Total <= 12.5;

  const comparisonMsg = isBelowAverage
    ? `Your footprint of ${summary.co2Total} kg CO₂ is ${((12.5 - summary.co2Total) / 12.5 * 100).toFixed(0)}% lower than the national daily average of 12.5 kg.`
    : `Your footprint of ${summary.co2Total} kg CO₂ is ${((summary.co2Total - 12.5) / 12.5 * 100).toFixed(0)}% higher than the national daily average of 12.5 kg.`;

  const recommendations: Recommendation[] = [];

  if (biggest === "Transport") {
    recommendations.push(
      { title: "Switch to Electric or Public Transit", description: "Taking the train or bus instead of driving a single-occupancy car cuts travel emissions by over 60%.", impact_saved: 3.2 },
      { title: "Consolidate Daily Errands", description: "Combine multiple short driving trips into one planned route to eliminate engine warm-up emissions.", impact_saved: 1.5 },
      { title: "Try Cycling or Walking for Short Trips", description: "For distances under 3 km, active transit produces zero emissions and improves cardiovascular health.", impact_saved: 0.9 },
      { title: "Eco-Friendly Driving Habits", description: "Maintain steady speeds and properly inflated tires to improve vehicle fuel efficiency by up to 10%.", impact_saved: 0.6 }
    );
  } else if (biggest === "Energy") {
    recommendations.push(
      { title: "Switch to a Renewable Energy Tariff", description: "Transitioning to 100% solar or wind grid options removes home electricity emissions completely.", impact_saved: 4.1 },
      { title: "Smart Thermostat Schedule", description: "Lowering heating by 1°C during sleep or away hours saves significant power across the year.", impact_saved: 1.8 },
      { title: "Unplug Phantom Power Loads", description: "Use smart power strips to shut off electronics on standby mode when not in active use.", impact_saved: 0.7 },
      { title: "LED Lighting Upgrade", description: "Replacing remaining incandescent bulbs with LEDs uses up to 80% less energy per hour.", impact_saved: 0.5 }
    );
  } else if (biggest === "Food") {
    recommendations.push(
      { title: "Adopt Plant-Forward Meal Plan", description: "Replacing 2 meat meals per week with legumes or tofu reduces dietary carbon intensity dramatically.", impact_saved: 2.8 },
      { title: "Zero Food Waste Kitchen", description: "Plan meals weekly and freeze leftovers to eliminate food spoilage in landfills.", impact_saved: 1.6 },
      { title: "Buy Local & In-Season Produce", description: "Choosing seasonal vegetables reduces energy expended in refrigerated long-haul freight.", impact_saved: 0.9 },
      { title: "Opt for Oat or Soy Dairy Alternatives", description: "Plant milks generate less than a third of the emissions produced by traditional dairy.", impact_saved: 0.6 }
    );
  } else {
    recommendations.push(
      { title: "Embrace Slow Fashion & Repair", description: "Buying pre-owned clothing or mending garments extends lifespan and reduces textile manufacturing demand.", impact_saved: 2.2 },
      { title: "Group Online Deliveries", description: "Select slower consolidated shipping options to minimize single-package courier journeys.", impact_saved: 1.4 },
      { title: "Choose Refurbished Electronics", description: "Opt for certified refurbished devices to save raw material extraction and e-waste.", impact_saved: 1.1 },
      { title: "Minimal Packaging Shopping", description: "Bring reusable tote bags and purchase package-free bulk goods whenever possible.", impact_saved: 0.7 }
    );
  }

  return {
    summary: `Your daily carbon footprint is currently ${summary.co2Total} kg CO₂, achieving an EcoScore of ${summary.ecoScore} (${summary.grade}). Your largest emission factor stems from ${biggest}.`,
    score: summary.ecoScore,
    grade: summary.grade,
    biggest_contributor: biggest,
    comparison: comparisonMsg,
    recommendations,
  };
}

export interface TransportPredictionResult {
  predictedMode: "walk" | "bike" | "bus" | "train" | "car" | "motorcycle";
  confidenceScore: number;
  reasoning: string;
  isAmbiguous: boolean;
}

export async function predictTransportModeWithAI(
  speedKmH: number,
  distanceKm: number,
  userCorrections: { predictedMode: string; actualMode: string }[] = []
): Promise<TransportPredictionResult> {
  const apiKey = process.env.GROQ_API_KEY;

  // Rule-based fast heuristics
  if (speedKmH < 7 && distanceKm < 15) {
    return { predictedMode: "walk", confidenceScore: 0.98, reasoning: "Pace < 7 km/h matches active walking/running stride.", isAmbiguous: false };
  }
  if (speedKmH >= 7 && speedKmH <= 22 && distanceKm < 30) {
    return { predictedMode: "bike", confidenceScore: 0.92, reasoning: "Velocity 7-22 km/h matches urban cycling cadence.", isAmbiguous: false };
  }

  // Use Groq LLM for ambiguous speeds (e.g. 18-35 km/h city bus vs e-bike traffic, high-speed rail vs car)
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey });
      const promptText = `
You are an AI Sensor & Mobility Classification Expert.
Analyze this movement session:
- Average Speed: ${speedKmH} km/h
- Trip Distance: ${distanceKm} km
- User Past Correction History: ${JSON.stringify(userCorrections)}

Classify the transport mode into ONE of: ["walk", "bike", "bus", "train", "car", "motorcycle"].
Return ONLY valid JSON matching this schema:
{
  "predictedMode": "bus",
  "confidenceScore": 0.85,
  "reasoning": "1-sentence explanation considering velocity, distance, and past user corrections"
}
`;
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: promptText }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.predictedMode && typeof parsed.confidenceScore === "number") {
          return {
            predictedMode: parsed.predictedMode.toLowerCase(),
            confidenceScore: Math.min(1.0, Math.max(0.1, parsed.confidenceScore)),
            reasoning: parsed.reasoning || "AI model classification based on telemetry.",
            isAmbiguous: parsed.confidenceScore < 0.85,
          };
        }
      }
    } catch (err) {
      console.warn("Groq transport prediction fallback:", err);
    }
  }

  // Heuristic Fallback
  if (speedKmH > 70 || distanceKm > 50) {
    return { predictedMode: "train", confidenceScore: 0.82, reasoning: "High speed / long distance corridor matches rail transit.", isAmbiguous: false };
  } else if (speedKmH > 25 && speedKmH <= 70) {
    return { predictedMode: "car", confidenceScore: 0.78, reasoning: "Urban motor speed range 25-70 km/h.", isAmbiguous: true };
  }

  return { predictedMode: "bus", confidenceScore: 0.75, reasoning: "City speed range 20-35 km/h with frequent stops.", isAmbiguous: true };
}

export interface MultiTimeframeSummaryResponse {
  timeframe: "daily" | "weekly" | "monthly";
  totalCo2Kg: number;
  co2SavedVsCar: number;
  topMode: string;
  insights: string[];
  forecastNextPeriodCo2Kg: number;
  recommendations: Recommendation[];
}

export async function generateMultiTimeframeSummary(
  timeframe: "daily" | "weekly" | "monthly",
  entries: any[]
): Promise<MultiTimeframeSummaryResponse> {
  const totalCo2Kg = Number(entries.reduce((sum, e) => sum + (e.co2Total || 0), 0).toFixed(2));
  const activeKm = entries.reduce((sum, e) => (e.transportMode === "walk" || e.transportMode === "bike" ? sum + (e.transportKm || 0) : sum), 0);
  const co2SavedVsCar = Number((activeKm * 0.21).toFixed(2));

  // Determine top transport mode
  const modeCounts: Record<string, number> = {};
  entries.forEach((e) => {
    const m = e.transportMode || "car";
    modeCounts[m] = (modeCounts[m] || 0) + (e.transportKm || 1);
  });
  const topMode = Object.keys(modeCounts).sort((a, b) => modeCounts[b] - modeCounts[a])[0] || "car";

  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      const groq = new Groq({ apiKey });
      const promptText = `
You are EcoSense AI. Generate a ${timeframe.toUpperCase()} Sustainability Summary.
Data:
- Total CO2: ${totalCo2Kg} kg
- Active Offset Saved vs Car: ${co2SavedVsCar} kg
- Top Transport Mode: ${topMode}
- Entries Count: ${entries.length}

Return ONLY JSON:
{
  "insights": [
    "3 specific bullet insights about their ${timeframe} emissions and active transport progress"
  ],
  "forecastNextPeriodCo2Kg": ${Number((totalCo2Kg * 0.92).toFixed(1))},
  "recommendations": [
    { "title": "Recommendation Title", "description": "1-sentence tip", "impact_saved": 1.5 }
  ]
}
`;
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: promptText }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
      });

      const text = completion.choices[0]?.message?.content || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.insights)) {
          return {
            timeframe,
            totalCo2Kg,
            co2SavedVsCar,
            topMode,
            insights: parsed.insights,
            forecastNextPeriodCo2Kg: parsed.forecastNextPeriodCo2Kg || Number((totalCo2Kg * 0.9).toFixed(1)),
            recommendations: parsed.recommendations || [],
          };
        }
      }
    } catch (err) {
      console.warn("Groq multi-timeframe summary fallback:", err);
    }
  }

  // Intelligent Fallback
  return {
    timeframe,
    totalCo2Kg,
    co2SavedVsCar,
    topMode,
    insights: [
      `Your total ${timeframe} emissions reached ${totalCo2Kg} kg CO₂.`,
      `By choosing active travel, you offset ${co2SavedVsCar} kg CO₂ compared to driving.`,
      `Your primary transport mode was ${topMode.toUpperCase()}.`,
    ],
    forecastNextPeriodCo2Kg: Number((totalCo2Kg * 0.88).toFixed(1)),
    recommendations: [
      { title: "Increase Active Micro-mobility", description: "Replacing short motor trips with walking or cycling reduces emissions to 0.", impact_saved: 2.1 },
      { title: "Optimize Route Batching", description: "Consolidate multiple errands into single continuous loops.", impact_saved: 1.4 },
    ],
  };
}
