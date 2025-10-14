export interface Village {
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: [number, number];
  fraType: 'IFR' | 'CFR';
  landArea: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  population: number;
  forestCover: number;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'scheme' | 'announcement' | 'warning' | 'update';
  priority: 'high' | 'medium' | 'low';
  coordinates: [number, number];
  village?: string;
  state: string;
  district: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  targetAudience: 'all' | 'local' | 'government';
  attachments?: string[];
}

export interface State {
  name: string;
  districts: string[];
}

export const mockVillages: Village[] = [
  {
    id: '1',
    name: 'Kumhargaon',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    coordinates: [22.5957, 80.3689],
    fraType: 'CFR',
    landArea: 1250,
    status: 'Approved',
    population: 2847,
    forestCover: 78,
    lastUpdated: '2024-01-15'
  },
  {
    id: '3',
    name: 'Seoni Range Hamlet',
    state: 'Madhya Pradesh',
    district: 'Seoni',
    coordinates: [22.0950, 79.5430],
    fraType: 'IFR',
    landArea: 740,
    status: 'Approved',
    population: 1720,
    forestCover: 70,
    lastUpdated: '2024-01-12'
  },
  {
    id: '2',
    name: 'Patalkot',
    state: 'Madhya Pradesh',
    district: 'Chhindwara',
    coordinates: [22.0696, 78.9390],
    fraType: 'IFR',
    landArea: 890,
    status: 'Pending',
    population: 1653,
    forestCover: 65,
    lastUpdated: '2024-01-10'
  },
  {
    id: '6',
    name: 'Boipariguda',
    state: 'Odisha',
    district: 'Koraput',
    coordinates: [18.8070, 82.6930],
    fraType: 'CFR',
    landArea: 1320,
    status: 'Pending',
    population: 2410,
    forestCover: 66,
    lastUpdated: '2024-01-09'
  },
  {
    id: '4',
    name: 'Jhirnia',
    state: 'Odisha',
    district: 'Rayagada',
    coordinates: [19.1663, 83.4156],
    fraType: 'IFR',
    landArea: 1560,
    status: 'Rejected',
    population: 2156,
    forestCover: 45,
    lastUpdated: '2024-01-08'
  },
  {
    id: '5',
    name: 'Kendupali',
    state: 'Odisha',
    district: 'Kalahandi',
    coordinates: [20.0484, 83.1648],
    fraType: 'CFR',
    landArea: 1890,
    status: 'Approved',
    population: 2890,
    forestCover: 71,
    lastUpdated: '2024-01-18'
  },
  {
    id: '9',
    name: 'Satkosia Fringe',
    state: 'Odisha',
    district: 'Angul',
    coordinates: [20.6480, 85.0940],
    fraType: 'IFR',
    landArea: 980,
    status: 'Approved',
    population: 2042,
    forestCover: 77,
    lastUpdated: '2024-01-16'
  },
  {
    id: '7',
    name: 'Kothagudem',
    state: 'Telangana',
    district: 'Khammam',
    coordinates: [17.5512, 80.6177],
    fraType: 'CFR',
    landArea: 1450,
    status: 'Approved',
    population: 2156,
    forestCover: 68,
    lastUpdated: '2024-01-14'
  },
  {
    id: '10',
    name: 'Utnoor',
    state: 'Telangana',
    district: 'Adilabad',
    coordinates: [19.3667, 78.7167],
    fraType: 'CFR',
    landArea: 1180,
    status: 'Pending',
    population: 2385,
    forestCover: 62,
    lastUpdated: '2024-01-13'
  },
  {
    id: '11',
    name: 'Eturnagaram',
    state: 'Telangana',
    district: 'Mulugu',
    coordinates: [18.3330, 80.4330],
    fraType: 'IFR',
    landArea: 1360,
    status: 'Approved',
    population: 1924,
    forestCover: 74,
    lastUpdated: '2024-01-17'
  },
  {
    id: '12',
    name: 'Bhamragad Border Hamlet',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    coordinates: [21.9850, 80.2670],
    fraType: 'CFR',
    landArea: 1015,
    status: 'Rejected',
    population: 1678,
    forestCover: 49,
    lastUpdated: '2024-01-06'
  },
  {
    id: '13',
    name: 'Phiringia',
    state: 'Odisha',
    district: 'Kandhamal',
    coordinates: [20.1400, 84.0000],
    fraType: 'IFR',
    landArea: 870,
    status: 'Pending',
    population: 1542,
    forestCover: 58,
    lastUpdated: '2024-01-07'
  },
  {
    id: '14',
    name: 'Simdega Road Hamlet',
    state: 'Odisha',
    district: 'Sundargarh',
    coordinates: [22.1080, 84.0370],
    fraType: 'CFR',
    landArea: 1420,
    status: 'Approved',
    population: 2230,
    forestCover: 72,
    lastUpdated: '2024-01-19'
  },
  {
    id: '15',
    name: 'Khowai Range Hamlet',
    state: 'Tripura',
    district: 'Khowai',
    coordinates: [24.0540, 91.6000],
    fraType: 'IFR',
    landArea: 690,
    status: 'Approved',
    population: 1395,
    forestCover: 64,
    lastUpdated: '2024-01-05'
  },
  {
    id: '8',
    name: 'Agartala Forest',
    state: 'Tripura',
    district: 'Dhalai',
    coordinates: [23.8315, 91.2862],
    fraType: 'IFR',
    landArea: 920,
    status: 'Pending',
    population: 1834,
    forestCover: 72,
    lastUpdated: '2024-01-11'
  },
  {
    id: '16',
    name: 'Udaipur (Gomati) Fringe',
    state: 'Tripura',
    district: 'Gomati',
    coordinates: [23.5330, 91.4800],
    fraType: 'CFR',
    landArea: 730,
    status: 'Approved',
    population: 1750,
    forestCover: 69,
    lastUpdated: '2024-01-18'
  },
  {
    id: '17',
    name: 'Jayashankar Block Hamlet',
    state: 'Telangana',
    district: 'Jayashankar Bhupalpally',
    coordinates: [18.4330, 80.0830],
    fraType: 'IFR',
    landArea: 960,
    status: 'Rejected',
    population: 1480,
    forestCover: 47,
    lastUpdated: '2024-01-04'
  },
  {
    id: '18',
    name: 'Panna Fringe Hamlet',
    state: 'Madhya Pradesh',
    district: 'Panna',
    coordinates: [24.7200, 80.2000],
    fraType: 'CFR',
    landArea: 1580,
    status: 'Approved',
    population: 2560,
    forestCover: 73,
    lastUpdated: '2024-01-20'
  }
  ,
  // Odisha-focused extra mock villages (CFR/IFR) for richer demos
  { id: '19', name: 'Ambasarmunda', state: 'Odisha', district: 'Angul', coordinates: [20.7002, 84.7204], fraType: 'IFR', landArea: 540, status: 'Approved', population: 2450, forestCover: 62, lastUpdated: '2024-01-20' },
  { id: '20', name: 'Boinda Block CFR', state: 'Odisha', district: 'Angul', coordinates: [20.8361, 84.7454], fraType: 'CFR', landArea: 1240, status: 'Pending', population: 1820, forestCover: 71, lastUpdated: '2024-01-18' },
  { id: '21', name: 'Athmallik Range Hamlet', state: 'Odisha', district: 'Angul', coordinates: [20.6949, 84.7318], fraType: 'IFR', landArea: 390, status: 'Approved', population: 1380, forestCover: 55, lastUpdated: '2024-01-11' },
  { id: '22', name: 'Kandhamal CFR Cluster', state: 'Odisha', district: 'Kandhamal', coordinates: [20.1802, 84.0221], fraType: 'CFR', landArea: 1680, status: 'Pending', population: 2680, forestCover: 69, lastUpdated: '2024-01-16' },
  { id: '23', name: 'Baliguda Hamlet', state: 'Odisha', district: 'Kandhamal', coordinates: [20.1877, 84.0642], fraType: 'IFR', landArea: 610, status: 'Rejected', population: 980, forestCover: 48, lastUpdated: '2024-01-07' },
  { id: '24', name: 'Bhawanipatna Fringe', state: 'Odisha', district: 'Kalahandi', coordinates: [19.9070, 83.1660], fraType: 'IFR', landArea: 720, status: 'Approved', population: 2120, forestCover: 63, lastUpdated: '2024-01-21' },
  { id: '25', name: 'Thuamul Rampur CFR', state: 'Odisha', district: 'Kalahandi', coordinates: [19.5838, 83.1152], fraType: 'CFR', landArea: 1985, status: 'Approved', population: 3050, forestCover: 76, lastUpdated: '2024-01-19' },
  { id: '26', name: 'Boriguma Hamlet', state: 'Odisha', district: 'Koraput', coordinates: [18.8144, 82.7376], fraType: 'IFR', landArea: 530, status: 'Pending', population: 1670, forestCover: 58, lastUpdated: '2024-01-12' },
  { id: '27', name: 'Boipariguda CFR North', state: 'Odisha', district: 'Koraput', coordinates: [18.7994, 82.7051], fraType: 'CFR', landArea: 1540, status: 'Approved', population: 2520, forestCover: 72, lastUpdated: '2024-01-14' },
  { id: '28', name: 'Rairangpur Fringe', state: 'Odisha', district: 'Mayurbhanj', coordinates: [22.2686, 86.1667], fraType: 'IFR', landArea: 640, status: 'Approved', population: 1890, forestCover: 67, lastUpdated: '2024-01-17' },
  { id: '29', name: 'Baripada CFR', state: 'Odisha', district: 'Mayurbhanj', coordinates: [21.9400, 86.7333], fraType: 'CFR', landArea: 1730, status: 'Pending', population: 2960, forestCover: 74, lastUpdated: '2024-01-13' },
  { id: '30', name: 'Sundargarh South Hamlet', state: 'Odisha', district: 'Sundargarh', coordinates: [22.0796, 84.0436], fraType: 'IFR', landArea: 590, status: 'Rejected', population: 1320, forestCover: 52, lastUpdated: '2024-01-06' },
  { id: '31', name: 'Bonai CFR', state: 'Odisha', district: 'Sundargarh', coordinates: [21.8714, 85.1632], fraType: 'CFR', landArea: 1620, status: 'Approved', population: 2420, forestCover: 70, lastUpdated: '2024-01-15' },
  { id: '32', name: 'Dhenkanal Range Hamlet', state: 'Odisha', district: 'Dhenkanal', coordinates: [20.6574, 85.5981], fraType: 'IFR', landArea: 520, status: 'Pending', population: 1750, forestCover: 61, lastUpdated: '2024-01-10' },
  { id: '33', name: 'Kamakshyanagar CFR', state: 'Odisha', district: 'Dhenkanal', coordinates: [20.9333, 85.5500], fraType: 'CFR', landArea: 1380, status: 'Approved', population: 2280, forestCover: 68, lastUpdated: '2024-01-18' },
  { id: '34', name: 'Kendrapara Coastal Hamlet', state: 'Odisha', district: 'Kendrapara', coordinates: [20.5000, 86.4200], fraType: 'IFR', landArea: 450, status: 'Approved', population: 1650, forestCover: 41, lastUpdated: '2024-01-09' },
  { id: '35', name: 'Rajkanika CFR', state: 'Odisha', district: 'Kendrapara', coordinates: [20.7400, 86.7400], fraType: 'CFR', landArea: 1490, status: 'Pending', population: 2390, forestCover: 57, lastUpdated: '2024-01-08' },
  { id: '36', name: 'Malkangiri Hamlet', state: 'Odisha', district: 'Malkangiri', coordinates: [18.3600, 81.9000], fraType: 'IFR', landArea: 610, status: 'Approved', population: 1720, forestCover: 64, lastUpdated: '2024-01-05' },
  { id: '37', name: 'Chitrakonda CFR', state: 'Odisha', district: 'Malkangiri', coordinates: [18.1000, 82.0833], fraType: 'CFR', landArea: 1880, status: 'Approved', population: 2800, forestCover: 79, lastUpdated: '2024-01-16' },
  { id: '38', name: 'Rayagada Hills Hamlet', state: 'Odisha', district: 'Rayagada', coordinates: [19.1663, 83.4156], fraType: 'IFR', landArea: 570, status: 'Pending', population: 1690, forestCover: 59, lastUpdated: '2024-01-07' },
  { id: '39', name: 'Gunupur CFR', state: 'Odisha', district: 'Rayagada', coordinates: [19.0800, 83.8000], fraType: 'CFR', landArea: 1520, status: 'Approved', population: 2460, forestCover: 71, lastUpdated: '2024-01-19' }
];

export const mockStates: State[] = [
  {
    name: 'Madhya Pradesh',
    districts: [
      'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
      'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
      'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
      'Hoshangabad (Narmadapuram)', 'Indore', 'Jabalpur', 'Jhabua', 'Katni',
      'Khandwa (East Nimar)', 'Khargone (West Nimar)', 'Mandla', 'Mandsaur',
      'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh',
      'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur',
      'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria',
      'Vidisha', 'Chachaura', 'Maihar', 'Nagda'
    ]
  },
  {
    name: 'Odisha',
    districts: [
      'Angul', 'Balangir', 'Balasore (Baleswar)', 'Bargarh', 'Bhadrak', 'Boudh',
      'Cuttack', 'Deogarh (Debagarh)', 'Dhenkanal', 'Gajapati', 'Ganjam',
      'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal',
      'Kendrapara', 'Keonjhar (Kendujhar)', 'Khordha', 'Koraput', 'Malkangiri',
      'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada',
      'Sambalpur', 'Subarnapur (Sonepur)', 'Sundargarh'
    ]
  },
  {
    name: 'Telangana',
    districts: [
      'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial',
      'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy',
      'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad',
      'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal–Malkajgiri', 'Mulugu',
      'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad',
      'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
      'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ]
  },
  {
    name: 'Tripura',
    districts: [
      'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala',
      'South Tripura', 'Unakoti', 'West Tripura'
    ]
  }
];

export const mockStatistics = {
  totalVillages: 118036,
  approvedClaims: 1122365,
  pendingClaims: 464074,
  rejectedClaims: 302,
  totalLandArea: 48750, // in hectares
  forestCoverPercent: 67.8,
  monthlyGrowth: [
    { month: 'Jan', approved: 145, pending: 89, rejected: 23 },
    { month: 'Feb', approved: 167, pending: 76, rejected: 19 },
    { month: 'Mar', approved: 189, pending: 94, rejected: 31 },
    { month: 'Apr', approved: 156, pending: 112, rejected: 28 },
    { month: 'May', approved: 198, pending: 87, rejected: 15 },
    { month: 'Jun', approved: 223, pending: 103, rejected: 22 }
  ]
};

export const mockRecommendations = [
  {
    id: '1',
    title: 'MGNREGA Integration',
    description: 'Link forest conservation activities with MGNREGA for sustainable income.',
    priority: 'High',
    villages: 34,
    estimatedImpact: '85%'
  },
  {
    id: '2',
    title: 'Bamboo Cultivation Scheme',
    description: 'Promote bamboo cultivation in suitable CFR areas for economic benefits.',
    priority: 'Medium',
    villages: 28,
    estimatedImpact: '72%'
  },
  {
    id: '3',
    title: 'Non-Timber Forest Produce',
    description: 'Establish collection and processing centers for NTFP.',
    priority: 'High',
    villages: 45,
    estimatedImpact: '91%'
  },
  {
    id: '4',
    title: 'Digital Documentation',
    description: 'Implement digital record keeping for better tracking.',
    priority: 'Low',
    villages: 67,
    estimatedImpact: '68%'
  }
];

export interface ForestArea {
  id: string;
  name: string;
  type: 'National Park' | 'Wildlife Sanctuary' | 'Reserve Forest' | 'Protected Forest' | 'Community Forest' | 'Forest Range';
  state: string;
  district: string;
  coordinates: [number, number];
  area: number; // in hectares
  forestCover: number; // percentage
  biodiversity: 'High' | 'Medium' | 'Low';
  protectionStatus: 'Protected' | 'Semi-Protected' | 'Community Managed';
  establishedYear: number;
  description: string;
  threats: string[];
  conservationMeasures: string[];
  lastSurvey: string;
  isActive: boolean;
}

export const mockForestAreas: ForestArea[] = [
  {
    id: '1',
    name: 'Similipal National Park',
    type: 'National Park',
    state: 'Odisha',
    district: 'Mayurbhanj',
    coordinates: [21.7500, 86.3333],
    area: 2750,
    forestCover: 85,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1980,
    description: 'Famous for its tiger reserve and diverse wildlife including elephants, leopards, and various bird species.',
    threats: ['Poaching', 'Habitat fragmentation', 'Human-wildlife conflict'],
    conservationMeasures: ['Anti-poaching patrols', 'Community awareness programs', 'Habitat restoration'],
    lastSurvey: '2024-01-15',
    isActive: true
  },
  {
    id: '2',
    name: 'Karlapat Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Odisha',
    district: 'Kalahandi',
    coordinates: [19.1663, 83.4156],
    area: 175,
    forestCover: 78,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1992,
    description: 'Home to various wildlife species including elephants, leopards, and numerous bird species.',
    threats: ['Mining activities', 'Deforestation', 'Illegal logging'],
    conservationMeasures: ['Regular patrolling', 'Community engagement', 'Eco-tourism development'],
    lastSurvey: '2024-01-10',
    isActive: true
  },
  {
    id: '3',
    name: 'Bamra-Gangpur Forest',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Sambalpur',
    coordinates: [21.4667, 83.9833],
    area: 1250,
    forestCover: 72,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1950,
    description: 'Mixed deciduous forest with significant teak and sal plantations.',
    threats: ['Illegal logging', 'Encroachment', 'Fire incidents'],
    conservationMeasures: ['Fire prevention measures', 'Community forest management', 'Reforestation programs'],
    lastSurvey: '2024-01-08',
    isActive: true
  },
  {
    id: '4',
    name: 'Dhenkanal Forest Range',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Dhenkanal',
    coordinates: [20.6667, 85.6000],
    area: 890,
    forestCover: 68,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1960,
    description: 'Tropical dry deciduous forest with mixed species composition.',
    threats: ['Agricultural expansion', 'Grazing pressure', 'Climate change'],
    conservationMeasures: ['Sustainable forest management', 'Water conservation', 'Biodiversity monitoring'],
    lastSurvey: '2024-01-12',
    isActive: true
  },
  {
    id: '5',
    name: 'Sitabinji Forest Range',
    type: 'Forest Range',
    state: 'Odisha',
    district: 'Keonjhar',
    coordinates: [21.6333, 85.5833],
    area: 650,
    forestCover: 75,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1975,
    description: 'Rich biodiversity hotspot with ancient rock paintings and diverse flora.',
    threats: ['Mining activities', 'Tourism pressure', 'Pollution'],
    conservationMeasures: ['Heritage site protection', 'Eco-tourism regulation', 'Pollution control'],
    lastSurvey: '2024-01-05',
    isActive: true
  },
  {
    id: '6',
    name: 'Kanha National Park',
    type: 'National Park',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    coordinates: [22.1667, 80.6167],
    area: 1945,
    forestCover: 90,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1955,
    description: 'Famous for its tiger population and diverse wildlife including barasingha, leopards, and various bird species.',
    threats: ['Tourism pressure', 'Habitat fragmentation', 'Climate change'],
    conservationMeasures: ['Tiger conservation programs', 'Eco-tourism management', 'Habitat restoration'],
    lastSurvey: '2024-01-18',
    isActive: true
  },
  {
    id: '7',
    name: 'Pench National Park',
    type: 'National Park',
    state: 'Madhya Pradesh',
    district: 'Chhindwara',
    coordinates: [21.7000, 79.3000],
    area: 758,
    forestCover: 88,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1975,
    description: 'Inspiration for Rudyard Kipling\'s "The Jungle Book", known for its tiger and leopard population.',
    threats: ['Human-wildlife conflict', 'Poaching', 'Habitat loss'],
    conservationMeasures: ['Anti-poaching units', 'Community awareness', 'Wildlife corridor protection'],
    lastSurvey: '2024-01-14',
    isActive: true
  },
  {
    id: '8',
    name: 'Kothagudem Forest Range',
    type: 'Forest Range',
    state: 'Telangana',
    district: 'Khammam',
    coordinates: [17.5512, 80.6177],
    area: 450,
    forestCover: 65,
    biodiversity: 'Medium',
    protectionStatus: 'Semi-Protected',
    establishedYear: 1985,
    description: 'Mixed forest with significant bamboo and teak plantations.',
    threats: ['Mining activities', 'Urban expansion', 'Water scarcity'],
    conservationMeasures: ['Water conservation', 'Sustainable mining practices', 'Urban planning integration'],
    lastSurvey: '2024-01-11',
    isActive: true
  },
  {
    id: '9',
    name: 'Gomati Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Tripura',
    district: 'Gomati',
    coordinates: [23.5000, 91.5000],
    area: 389,
    forestCover: 82,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1988,
    description: 'Tropical evergreen forest with rich biodiversity and various endangered species.',
    threats: ['Deforestation', 'Illegal logging', 'Climate change'],
    conservationMeasures: ['Strict protection', 'Community conservation', 'Research programs'],
    lastSurvey: '2024-01-09',
    isActive: true
  },
  {
    id: '10',
    name: 'Trishna Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Tripura',
    district: 'Dhalai',
    coordinates: [23.8315, 91.2862],
    area: 195,
    forestCover: 85,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1988,
    description: 'Known for its bison population and diverse bird species.',
    threats: ['Habitat fragmentation', 'Poaching', 'Invasive species'],
    conservationMeasures: ['Wildlife monitoring', 'Anti-poaching patrols', 'Invasive species control'],
    lastSurvey: '2024-01-07',
    isActive: true
  }
  ,
  {
    id: '11',
    name: 'Satkosia Tiger Reserve',
    type: 'Wildlife Sanctuary',
    state: 'Odisha',
    district: 'Angul',
    coordinates: [20.5000, 85.2500],
    area: 963,
    forestCover: 83,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1976,
    description: 'Gorge of the Mahanadi with rich riparian and dry deciduous forests.',
    threats: ['Human-wildlife conflict', 'Poaching'],
    conservationMeasures: ['Habitat restoration', 'Eco-development committees'],
    lastSurvey: '2024-01-13',
    isActive: true
  },
  {
    id: '12',
    name: 'Kawal Tiger Reserve',
    type: 'Wildlife Sanctuary',
    state: 'Telangana',
    district: 'Nirmal',
    coordinates: [19.1330, 78.9330],
    area: 893,
    forestCover: 76,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 2012,
    description: 'Dry deciduous forests with tiger, leopard and herbivore populations.',
    threats: ['Encroachment', 'Illegal felling'],
    conservationMeasures: ['Anti-poaching patrols', 'Corridor protection'],
    lastSurvey: '2024-01-16',
    isActive: true
  },
  {
    id: '13',
    name: 'Sepahijala Wildlife Sanctuary',
    type: 'Wildlife Sanctuary',
    state: 'Tripura',
    district: 'Sepahijala',
    coordinates: [23.6667, 91.3000],
    area: 18,
    forestCover: 81,
    biodiversity: 'High',
    protectionStatus: 'Protected',
    establishedYear: 1972,
    description: 'Lowland evergreen and moist deciduous forests with primate diversity.',
    threats: ['Tourism pressure'],
    conservationMeasures: ['Visitor management', 'Habitat enrichment'],
    lastSurvey: '2024-01-10',
    isActive: true
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'New Forest Rights Scheme Launch',
    message: 'A new forest rights scheme has been launched for the region. All eligible communities can apply for additional land rights and conservation benefits. Contact your local forest department for more information.',
    type: 'scheme',
    priority: 'high',
    coordinates: [22.5957, 80.3689],
    village: 'Kumhargaon',
    state: 'Madhya Pradesh',
    district: 'Mandla',
    createdBy: 'Forest Department MP',
    createdAt: '2024-01-20T10:00:00Z',
    expiresAt: '2024-03-20T10:00:00Z',
    isActive: true,
    targetAudience: 'local',
    attachments: ['scheme-guidelines.pdf', 'application-form.pdf']
  },
  {
    id: '2',
    title: 'Important Update: Document Verification',
    message: 'All pending forest rights applications in Kalahandi district will undergo verification next week. Please ensure all required documents are submitted by January 25th, 2024.',
    type: 'update',
    priority: 'high',
    coordinates: [20.0484, 83.1648],
    village: 'Kendupali',
    state: 'Odisha',
    district: 'Kalahandi',
    createdBy: 'District Forest Officer',
    createdAt: '2024-01-18T14:30:00Z',
    expiresAt: '2024-01-25T18:00:00Z',
    isActive: true,
    targetAudience: 'local'
  },
  {
    id: '3',
    title: 'Training: FRA Claim Documentation Workshop',
    message: 'Workshop scheduled for village secretaries on preparing complete FRA claim documents.',
    type: 'announcement',
    priority: 'medium',
    coordinates: [21.985, 80.267],
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    createdBy: 'MoTA Training Cell',
    createdAt: '2024-01-19T09:00:00Z',
    isActive: true,
    targetAudience: 'government'
  },
  {
    id: '4',
    title: 'Weather Warning: Heavy Rains Expected',
    message: 'Heavy rainfall is expected in the region for the next 3 days. Please take necessary precautions and avoid forest areas during this period.',
    type: 'warning',
    priority: 'high',
    coordinates: [19.1663, 83.4156],
    village: 'Jhirnia',
    state: 'Odisha',
    district: 'Rayagada',
    createdBy: 'Meteorological Department',
    createdAt: '2024-01-22T08:00:00Z',
    expiresAt: '2024-01-25T20:00:00Z',
    isActive: true,
    targetAudience: 'all'
  },
  {
    id: '5',
    title: 'Satellite Update: Forest Cover Change (Q1)',
    message: 'Remote sensing indicates minor changes in forest cover across selected districts. Review analytics for details.',
    type: 'update',
    priority: 'medium',
    coordinates: [21.75, 86.33],
    state: 'Odisha',
    district: 'Mayurbhanj',
    createdBy: 'NIC Remote Sensing',
    createdAt: '2024-01-17T08:30:00Z',
    isActive: true,
    targetAudience: 'government'
  },
  {
    id: '6',
    title: 'Community Meeting Scheduled',
    message: 'Gram Sabha meeting scheduled to discuss CFR boundary demarcation and NTFP collection plan.',
    type: 'announcement',
    priority: 'low',
    coordinates: [20.14, 84.0],
    state: 'Odisha',
    district: 'Kandhamal',
    createdBy: 'District Administration',
    createdAt: '2024-01-14T12:00:00Z',
    isActive: true,
    targetAudience: 'local'
  },
  {
    id: '7',
    title: 'Training: Digital Application Filing',
    message: 'Capacity-building session for field officers on digital FRA application workflows.',
    type: 'announcement',
    priority: 'medium',
    coordinates: [23.533, 91.48],
    state: 'Tripura',
    district: 'Gomati',
    createdBy: 'MoTA',
    createdAt: '2024-01-13T10:00:00Z',
    isActive: true,
    targetAudience: 'government'
  },
  {
    id: '8',
    title: 'System Maintenance Window',
    message: 'FRA portal will undergo maintenance on Sunday 2 AM–4 AM IST. Expect intermittent downtime.',
    type: 'update',
    priority: 'low',
    coordinates: [28.61, 77.21],
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    createdBy: 'NIC',
    createdAt: '2024-01-21T18:00:00Z',
    isActive: true,
    targetAudience: 'all'
  },
  {
    id: '9',
    title: 'Field Verification Drive',
    message: 'Special drive for pending field verification in Seoni and Chhindwara next week.',
    type: 'update',
    priority: 'medium',
    coordinates: [22.095, 79.543],
    state: 'Madhya Pradesh',
    district: 'Seoni',
    createdBy: 'Forest Department MP',
    createdAt: '2024-01-16T09:30:00Z',
    isActive: true,
    targetAudience: 'government'
  },
  {
    id: '10',
    title: 'Public Advisory: Fire Risk',
    message: 'Increased forest fire risk reported by FSI. Avoid controlled burning and report incidents.',
    type: 'warning',
    priority: 'high',
    coordinates: [17.5512, 80.6177],
    state: 'Telangana',
    district: 'Khammam',
    createdBy: 'FSI',
    createdAt: '2024-01-23T06:00:00Z',
    isActive: true,
    targetAudience: 'all'
  }
];

// Extra mock data for complaints and FRA applications consumers
export interface ComplaintItem {
  id: number;
  village: string;
  user: string;
  issue: string;
  status: 'open' | 'in-progress' | 'resolved';
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export const mockComplaints: ComplaintItem[] = [
  { id: 101, village: 'Utnoor', user: 'Asha Devi', issue: 'Map boundary mismatch with RoR', status: 'open', date: '2024-01-12', priority: 'high' },
  { id: 102, village: 'Boipariguda', user: 'Suresh Nayak', issue: 'Application stuck in verification', status: 'in-progress', date: '2024-01-11', priority: 'medium' },
  { id: 103, village: 'Phiringia', user: 'Mina Pradhan', issue: 'Unable to upload supporting documents', status: 'resolved', date: '2024-01-08', priority: 'low' },
  { id: 104, village: 'Kothagudem', user: 'Ravi Kumar', issue: 'Wrong district displayed', status: 'open', date: '2024-01-07', priority: 'low' },
  { id: 105, village: 'Simdega Road Hamlet', user: 'Rakesh Oraon', issue: 'Duplicate entry for an application', status: 'in-progress', date: '2024-01-05', priority: 'medium' },
  { id: 106, village: 'Kumhargaon', user: 'Deepak Verma', issue: 'Status not updating after approval', status: 'open', date: '2024-01-04', priority: 'medium' },
  { id: 107, village: 'Kendupali', user: 'Leela Naik', issue: 'Title certificate typo in name', status: 'in-progress', date: '2024-01-03', priority: 'low' },
  { id: 108, village: 'Boipariguda', user: 'Prakash Jena', issue: 'Unable to download title certificate', status: 'resolved', date: '2024-01-02', priority: 'low' },
  { id: 109, village: 'Eturnagaram', user: 'Soma Reddy', issue: 'Coordinates off by ~200m', status: 'open', date: '2024-01-02', priority: 'high' },
  { id: 110, village: 'Udaipur (Gomati) Fringe', user: 'Nini Debnath', issue: 'Village name not found in dropdown', status: 'open', date: '2023-12-31', priority: 'medium' },
  { id: 111, village: 'Satkosia Fringe', user: 'Hari Prasad', issue: 'Boundaries overlapping nearby village', status: 'in-progress', date: '2023-12-30', priority: 'high' },
  { id: 112, village: 'Patalkot', user: 'Mohan Lal', issue: 'Document preview not loading', status: 'resolved', date: '2023-12-29', priority: 'low' }
];

export interface FRAApplicationItem {
  id: string;
  applicantName: string;
  village: string;
  district: string;
  state: string;
  landArea: string;
  landType: 'individual' | 'community' | 'habitation';
  claimType: string;
  description: string;
  supportingDocuments: string[];
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  submittedAt: Date;
  reviewedBy?: string;
  reviewNotes?: string;
}

export const mockFRAApplications: FRAApplicationItem[] = [
  { id: 'FRA-004', applicantName: 'Sita Bai', village: 'Kumhargaon', district: 'Mandla', state: 'Madhya Pradesh', landArea: '1.8 acres', landType: 'individual', claimType: 'individual_forest_rights', description: 'Cultivation land used since 1995', supportingDocuments: [], status: 'submitted', priority: 'low', submittedAt: new Date('2024-01-09') },
  { id: 'FRA-005', applicantName: 'Gram Sabha Boipariguda', village: 'Boipariguda', district: 'Koraput', state: 'Odisha', landArea: '32 acres', landType: 'community', claimType: 'community_forest_rights', description: 'Community rights for NTFP collection', supportingDocuments: [], status: 'under_review', priority: 'high', submittedAt: new Date('2024-01-08'), reviewedBy: 'DFO Koraput' },
  { id: 'FRA-006', applicantName: 'Habitation Committee', village: 'Eturnagaram', district: 'Mulugu', state: 'Telangana', landArea: '12 acres', landType: 'habitation', claimType: 'community_forest_resource_rights', description: 'Habitation use rights for minor forest produce', supportingDocuments: [], status: 'approved', priority: 'medium', submittedAt: new Date('2023-12-30'), reviewedBy: 'MoTA' },
  { id: 'FRA-007', applicantName: 'Ramesh Soren', village: 'Seoni Range Hamlet', district: 'Seoni', state: 'Madhya Pradesh', landArea: '2.1 acres', landType: 'individual', claimType: 'individual_forest_rights', description: 'Traditional cultivation plot', supportingDocuments: [], status: 'under_review', priority: 'medium', submittedAt: new Date('2024-01-07') },
  { id: 'FRA-008', applicantName: 'Gram Sabha Kendupali', village: 'Kendupali', district: 'Kalahandi', state: 'Odisha', landArea: '18 acres', landType: 'community', claimType: 'community_forest_rights', description: 'Fuelwood and grazing management area', supportingDocuments: [], status: 'submitted', priority: 'low', submittedAt: new Date('2024-01-06') },
  { id: 'FRA-009', applicantName: 'Jayashankar Hamlet', village: 'Jayashankar Block Hamlet', district: 'Jayashankar Bhupalpally', state: 'Telangana', landArea: '9 acres', landType: 'habitation', claimType: 'community_forest_resource_rights', description: 'Shared CFR for minor forest produce', supportingDocuments: [], status: 'approved', priority: 'high', submittedAt: new Date('2023-12-28'), reviewedBy: 'State Committee' },
  { id: 'FRA-010', applicantName: 'Tribal Co-op', village: 'Udaipur (Gomati) Fringe', district: 'Gomati', state: 'Tripura', landArea: '6.5 acres', landType: 'community', claimType: 'community_forest_rights', description: 'NTFP collection area', supportingDocuments: [], status: 'rejected', priority: 'low', submittedAt: new Date('2023-12-27'), reviewedBy: 'District Level Committee', reviewNotes: 'Insufficient evidence' }
];