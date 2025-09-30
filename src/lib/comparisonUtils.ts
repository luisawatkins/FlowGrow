import {
  Property,
  PropertyMetrics,
  ComparisonMetric,
  ComparisonProperty,
  PropertyComparison,
  ComparisonCriteria,
  ComparisonCriteriaType,
  PropertyType,
  PropertyCondition
} from '@/types/comparison';

/**
 * Calculate property metrics for comparison
 */
export function calculatePropertyMetrics(
  property: Property,
  allProperties: Property[]
): PropertyMetrics {
  const priceScore = calculatePriceScore(property, allProperties);
  const valueScore = calculateValueScore(property, allProperties);
  const affordabilityScore = calculateAffordabilityScore(property, allProperties);
  const locationScore = calculateLocationScore(property, allProperties);
  const neighborhoodScore = calculateNeighborhoodScore(property, allProperties);
  const accessibilityScore = calculateAccessibilityScore(property, allProperties);
  const sizeScore = calculateSizeScore(property, allProperties);
  const conditionScore = calculateConditionScore(property, allProperties);
  const featureScore = calculateFeatureScore(property, allProperties);
  const investmentScore = calculateInvestmentScore(property, allProperties);
  const cashFlowScore = calculateCashFlowScore(property, allProperties);
  const appreciationScore = calculateAppreciationScore(property, allProperties);

  const overallScore = calculateOverallScore({
    priceScore,
    valueScore,
    affordabilityScore,
    locationScore,
    neighborhoodScore,
    accessibilityScore,
    sizeScore,
    conditionScore,
    featureScore,
    investmentScore,
    cashFlowScore,
    appreciationScore
  });

  return {
    priceScore,
    valueScore,
    affordabilityScore,
    locationScore,
    neighborhoodScore,
    accessibilityScore,
    sizeScore,
    conditionScore,
    featureScore,
    investmentScore,
    cashFlowScore,
    appreciationScore,
    overallScore,
    priceComparison: createComparisonMetric(property.price, allProperties.map(p => p.price)),
    sizeComparison: createComparisonMetric(property.details.livingArea, allProperties.map(p => p.details.livingArea)),
    locationComparison: createComparisonMetric(locationScore, allProperties.map(p => calculateLocationScore(p, allProperties))),
    featureComparison: createComparisonMetric(featureScore, allProperties.map(p => calculateFeatureScore(p, allProperties)))
  };
}

/**
 * Calculate price score (0-100)
 */
function calculatePriceScore(property: Property, allProperties: Property[]): number {
  const prices = allProperties.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  
  if (maxPrice === minPrice) return 50;
  
  // Lower price gets higher score (better value)
  const normalizedPrice = (maxPrice - property.price) / (maxPrice - minPrice);
  return Math.round(normalizedPrice * 100);
}

/**
 * Calculate value score based on price per square foot
 */
function calculateValueScore(property: Property, allProperties: Property[]): number {
  const pricePerSqFt = property.financial.pricePerSqFt;
  const allPricePerSqFt = allProperties.map(p => p.financial.pricePerSqFt);
  const minPricePerSqFt = Math.min(...allPricePerSqFt);
  const maxPricePerSqFt = Math.max(...allPricePerSqFt);
  
  if (maxPricePerSqFt === minPricePerSqFt) return 50;
  
  // Lower price per sq ft gets higher score
  const normalizedValue = (maxPricePerSqFt - pricePerSqFt) / (maxPricePerSqFt - minPricePerSqFt);
  return Math.round(normalizedValue * 100);
}

/**
 * Calculate affordability score
 */
function calculateAffordabilityScore(property: Property, allProperties: Property[]): number {
  const totalMonthlyCost = property.financial.totalMonthlyCost;
  const allMonthlyCosts = allProperties.map(p => p.financial.totalMonthlyCost);
  const minCost = Math.min(...allMonthlyCosts);
  const maxCost = Math.max(...allMonthlyCosts);
  
  if (maxCost === minCost) return 50;
  
  // Lower cost gets higher score
  const normalizedCost = (maxCost - totalMonthlyCost) / (maxCost - minCost);
  return Math.round(normalizedCost * 100);
}

/**
 * Calculate location score
 */
function calculateLocationScore(property: Property, allProperties: Property[]): number {
  let score = 50; // Base score
  
  // City desirability (simplified)
  const cityScores: { [key: string]: number } = {
    'New York': 90,
    'Los Angeles': 85,
    'Chicago': 80,
    'Houston': 75,
    'Phoenix': 70,
    'Philadelphia': 75,
    'San Antonio': 70,
    'San Diego': 85,
    'Dallas': 75,
    'San Jose': 90
  };
  
  score = cityScores[property.location.city] || 60;
  
  // Adjust based on neighborhood
  if (property.location.neighborhood.toLowerCase().includes('downtown')) {
    score += 10;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate neighborhood score
 */
function calculateNeighborhoodScore(property: Property, allProperties: Property[]): number {
  let score = 60; // Base score
  
  // School district quality (simplified)
  if (property.location.schoolDistrict) {
    score += 20;
  }
  
  // Neighborhood type
  const neighborhood = property.location.neighborhood.toLowerCase();
  if (neighborhood.includes('historic') || neighborhood.includes('prestigious')) {
    score += 15;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate accessibility score
 */
function calculateAccessibilityScore(property: Property, allProperties: Property[]): number {
  let score = 50; // Base score
  
  // Public transportation access (simplified)
  if (property.specifications.utilities.includes('Public Transit')) {
    score += 20;
  }
  
  // Highway access
  if (property.location.address.toLowerCase().includes('highway') || 
      property.location.address.toLowerCase().includes('interstate')) {
    score += 15;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate size score
 */
function calculateSizeScore(property: Property, allProperties: Property[]): number {
  const livingArea = property.details.livingArea;
  const allAreas = allProperties.map(p => p.details.livingArea);
  const minArea = Math.min(...allAreas);
  const maxArea = Math.max(...allAreas);
  
  if (maxArea === minArea) return 50;
  
  // Larger area gets higher score
  const normalizedArea = (livingArea - minArea) / (maxArea - minArea);
  return Math.round(normalizedArea * 100);
}

/**
 * Calculate condition score
 */
function calculateConditionScore(property: Property, allProperties: Property[]): number {
  const conditionScores: { [key in PropertyCondition]: number } = {
    [PropertyCondition.EXCELLENT]: 100,
    [PropertyCondition.GOOD]: 80,
    [PropertyCondition.FAIR]: 60,
    [PropertyCondition.POOR]: 40,
    [PropertyCondition.NEEDS_WORK]: 20
  };
  
  return conditionScores[property.details.condition] || 50;
}

/**
 * Calculate feature score
 */
function calculateFeatureScore(property: Property, allProperties: Property[]): number {
  let score = 0;
  
  // Count features and amenities
  score += property.features.length * 2;
  score += property.amenities.length * 3;
  
  // Bonus for specific high-value features
  const highValueFeatures = ['Pool', 'Garage', 'Fireplace', 'Hardwood Floors', 'Updated Kitchen'];
  highValueFeatures.forEach(feature => {
    if (property.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
      score += 10;
    }
  });
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate investment score
 */
function calculateInvestmentScore(property: Property, allProperties: Property[]): number {
  let score = 50; // Base score
  
  // ROI bonus
  if (property.financial.roi && property.financial.roi > 0) {
    score += Math.min(30, property.financial.roi * 2);
  }
  
  // Cap rate bonus
  if (property.financial.capRate && property.financial.capRate > 0.05) {
    score += 20;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate cash flow score
 */
function calculateCashFlowScore(property: Property, allProperties: Property[]): number {
  if (!property.financial.rentalIncome) return 50;
  
  const netCashFlow = property.financial.rentalIncome - property.financial.totalMonthlyCost;
  
  if (netCashFlow > 0) {
    return Math.min(100, 50 + (netCashFlow / property.financial.rentalIncome) * 50);
  } else {
    return Math.max(0, 50 + (netCashFlow / property.financial.totalMonthlyCost) * 50);
  }
}

/**
 * Calculate appreciation score
 */
function calculateAppreciationScore(property: Property, allProperties: Property[]): number {
  let score = 50; // Base score
  
  // Historical appreciation
  if (property.financial.appreciation > 0) {
    score += Math.min(30, property.financial.appreciation * 10);
  }
  
  // Location-based appreciation potential
  const city = property.location.city.toLowerCase();
  const highAppreciationCities = ['san francisco', 'seattle', 'austin', 'denver'];
  if (highAppreciationCities.some(c => city.includes(c))) {
    score += 20;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate overall score
 */
function calculateOverallScore(scores: Partial<PropertyMetrics>): number {
  const weights = {
    priceScore: 0.15,
    valueScore: 0.15,
    affordabilityScore: 0.10,
    locationScore: 0.20,
    neighborhoodScore: 0.10,
    accessibilityScore: 0.05,
    sizeScore: 0.10,
    conditionScore: 0.10,
    featureScore: 0.05
  };
  
  let totalScore = 0;
  let totalWeight = 0;
  
  Object.entries(weights).forEach(([key, weight]) => {
    const score = scores[key as keyof PropertyMetrics] as number;
    if (score !== undefined) {
      totalScore += score * weight;
      totalWeight += weight;
    }
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
}

/**
 * Create comparison metric
 */
function createComparisonMetric(value: number, allValues: number[]): ComparisonMetric {
  const sortedValues = [...allValues].sort((a, b) => a - b);
  const rank = sortedValues.indexOf(value) + 1;
  const percentile = Math.round((rank / allValues.length) * 100);
  const isBest = value === Math.max(...allValues);
  const isWorst = value === Math.min(...allValues);
  const average = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
  const difference = value - average;
  const percentageDifference = average > 0 ? (difference / average) * 100 : 0;
  
  return {
    value,
    rank,
    percentile,
    isBest,
    isWorst,
    difference,
    percentageDifference
  };
}

/**
 * Rank properties in comparison
 */
export function rankProperties(properties: ComparisonProperty[]): ComparisonProperty[] {
  return properties
    .map((property, index) => ({
      ...property,
      rank: index + 1
    }))
    .sort((a, b) => b.score - a.score)
    .map((property, index) => ({
      ...property,
      rank: index + 1
    }));
}

/**
 * Generate comparison summary
 */
export function generateComparisonSummary(comparison: PropertyComparison): string {
  const { properties } = comparison;
  
  if (properties.length === 0) {
    return 'No properties to compare.';
  }
  
  const sortedProperties = properties.sort((a, b) => b.score - a.score);
  const winner = sortedProperties[0];
  const loser = sortedProperties[sortedProperties.length - 1];
  
  const priceRange = {
    min: Math.min(...properties.map(p => p.property.price)),
    max: Math.max(...properties.map(p => p.property.price))
  };
  
  const sizeRange = {
    min: Math.min(...properties.map(p => p.property.details.livingArea)),
    max: Math.max(...properties.map(p => p.property.details.livingArea))
  };
  
  return `Comparing ${properties.length} properties. Winner: ${winner.property.title} (Score: ${winner.score}/100). Price range: $${priceRange.min.toLocaleString()} - $${priceRange.max.toLocaleString()}. Size range: ${sizeRange.min.toLocaleString()} - ${sizeRange.max.toLocaleString()} sq ft.`;
}

/**
 * Validate comparison data
 */
export function validateComparison(comparison: Partial<PropertyComparison>): string[] {
  const errors: string[] = [];
  
  if (!comparison.name || comparison.name.trim().length === 0) {
    errors.push('Comparison name is required');
  }
  
  if (!comparison.properties || comparison.properties.length < 2) {
    errors.push('At least 2 properties are required for comparison');
  }
  
  if (comparison.properties && comparison.properties.length > 10) {
    errors.push('Maximum 10 properties allowed in comparison');
  }
  
  if (comparison.name && comparison.name.length > 100) {
    errors.push('Comparison name must be less than 100 characters');
  }
  
  return errors;
}

/**
 * Get default comparison criteria
 */
export function getDefaultComparisonCriteria(): ComparisonCriteria[] {
  return [
    {
      id: 'price',
      name: 'Price',
      weight: 0.25,
      type: ComparisonCriteriaType.PRICE,
      isEnabled: true,
      description: 'Property price comparison'
    },
    {
      id: 'size',
      name: 'Size',
      weight: 0.20,
      type: ComparisonCriteriaType.SIZE,
      isEnabled: true,
      description: 'Property size and living area'
    },
    {
      id: 'location',
      name: 'Location',
      weight: 0.20,
      type: ComparisonCriteriaType.LOCATION,
      isEnabled: true,
      description: 'Location and neighborhood quality'
    },
    {
      id: 'features',
      name: 'Features',
      weight: 0.15,
      type: ComparisonCriteriaType.FEATURES,
      isEnabled: true,
      description: 'Property features and amenities'
    },
    {
      id: 'condition',
      name: 'Condition',
      weight: 0.10,
      type: ComparisonCriteriaType.CONDITION,
      isEnabled: true,
      description: 'Property condition and maintenance'
    },
    {
      id: 'financial',
      name: 'Financial',
      weight: 0.10,
      type: ComparisonCriteriaType.FINANCIAL,
      isEnabled: true,
      description: 'Investment potential and ROI'
    }
  ];
}

/**
 * Calculate weighted score based on criteria
 */
export function calculateWeightedScore(
  property: ComparisonProperty,
  criteria: ComparisonCriteria[]
): number {
  let totalScore = 0;
  let totalWeight = 0;
  
  criteria.forEach(criterion => {
    if (!criterion.isEnabled) return;
    
    let score = 0;
    
    switch (criterion.type) {
      case ComparisonCriteriaType.PRICE:
        score = property.metrics.priceScore;
        break;
      case ComparisonCriteriaType.SIZE:
        score = property.metrics.sizeScore;
        break;
      case ComparisonCriteriaType.LOCATION:
        score = property.metrics.locationScore;
        break;
      case ComparisonCriteriaType.FEATURES:
        score = property.metrics.featureScore;
        break;
      case ComparisonCriteriaType.CONDITION:
        score = property.metrics.conditionScore;
        break;
      case ComparisonCriteriaType.FINANCIAL:
        score = property.metrics.investmentScore;
        break;
    }
    
    totalScore += score * criterion.weight;
    totalWeight += criterion.weight;
  });
  
  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}
