import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import education from "@/assets/campaign-education.jpg";
import water from "@/assets/campaign-water.jpg";
import women from "@/assets/campaign-women.jpg";
import child from "@/assets/campaign-child.jpg";
import healthcare from "@/assets/campaign-healthcare.jpg";
import emergency from "@/assets/campaign-emergency.jpg";
import tshirtHope from "@/assets/tshirt-hope.jpg";
import tshirtImpact from "@/assets/tshirt-impact.jpg";
import tshirtTogether from "@/assets/tshirt-together.jpg";

export const heroImage = hero;
export const aboutImage = about;

const imageMap: Record<string, string> = {
  education,
  water,
  women,
  child,
  healthcare,
  emergency,
  "tshirt-hope": tshirtHope,
  "tshirt-impact": tshirtImpact,
  "tshirt-together": tshirtTogether,
};

export function imageFor(key: string | null | undefined): string {
  return (key && imageMap[key]) || education;
}
