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
        parsed.recommendations.length === 4
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
