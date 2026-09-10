export interface CharacterStats {
  // Parameters
  gender: string;
  ethnicity: string;
  regionOfBirth: string;
  health: number;
  physicalStrength: number;
  intelligence: number;
  charisma: number;
  // Conditions
  socialStatus: string;
  occupation: string;
  wealth: string;
  education: string;
  startingAge: number;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollStat(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCharacter(): CharacterStats {
  const genders = ['Male', 'Female'];
  const ethnicities = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Dalit', 'Tribal'];
  const regions = [
    'Indraprastha (Delhi)',
    'Pataliputra (Patna)',
    'Ujjayini (Ujjain)',
    'Kanchipuram (Tamil Nadu)',
    'Dwaraka (Gujarat)',
    'Tamralipti (Bengal)',
    'Mathura (Uttar Pradesh)',
    'Vijayanagara (Karnataka)',
  ];
  const occupations = [
    'Farmer',
    'Merchant',
    'Soldier',
    'Artisan',
    'Scholar',
    'Healer',
    'Blacksmith',
    'Weaver',
    'Potter',
    'Temple Priest',
    'Royal Courtier',
    'Street Vendor',
    'Fisherman',
    'Stone Carver',
  ];
  const socialStatuses = ['Noble', 'Commoner', 'Outcaste'];
  const wealthLevels = ['Destitute', 'Poor', 'Modest', 'Comfortable', 'Wealthy'];
  const educationLevels = ['Illiterate', 'Basic', 'Apprenticed', 'Well-Educated', 'Scholarly'];

  return {
    startingAge: 18,
    gender: pick(genders),
    ethnicity: pick(ethnicities),
    regionOfBirth: pick(regions),
    health: rollStat(40, 100),
    physicalStrength: rollStat(20, 100),
    intelligence: rollStat(20, 100),
    charisma: rollStat(20, 100),
    socialStatus: pick(socialStatuses),
    occupation: pick(occupations),
    wealth: pick(wealthLevels),
    education: pick(educationLevels),
  };
}
