import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import education from "@/assets/campaign-education.jpg";
import water from "@/assets/campaign-water.jpg";
import women from "@/assets/campaign-women.jpg";
import child from "@/assets/campaign-child.jpg";
import healthcare from "@/assets/campaign-healthcare.jpg";
import emergency from "@/assets/campaign-emergency.jpg";
import givingHands from "@/assets/giving-hands.jpg";
import makeChange from "@/assets/make-change.jpg";
import careHands from "@/assets/care-hands.jpg";
import founderPortraitAsset from "@/assets/founder-portrait.jpg.asset.json";
import tshirtWhiteAsset from "@/assets/tshirt-white.jpg.asset.json";
import tshirtBlueAsset from "@/assets/tshirt-blue.jpg.asset.json";
import hoodieNavyAsset from "@/assets/hoodie-navy.jpg.asset.json";

export const heroImage = founderPortraitAsset.url;
export const aboutImage = about;
export const savannaImage = water;
export const givingHandsImage = givingHands;
export const makeChangeImage = makeChange;
export const careHandsImage = careHands;

export const tshirtWhite = tshirtWhiteAsset.url;
export const tshirtBlue = tshirtBlueAsset.url;
export const hoodieNavy = hoodieNavyAsset.url;

const imageMap: Record<string, string> = {
  education,
  water,
  women,
  child,
  healthcare,
  emergency,
  "tshirt-hope": tshirtWhite,
  "tshirt-impact": tshirtBlue,
  "tshirt-together": hoodieNavy,
  "tshirt-white": tshirtWhite,
  "tshirt-blue": tshirtBlue,
  "hoodie-navy": hoodieNavy,
};

export function imageFor(key: string | null | undefined): string {
  return (key && imageMap[key]) || education;
}
