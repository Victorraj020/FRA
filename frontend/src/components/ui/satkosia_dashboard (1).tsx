import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TreePine, Users, MapPin, IndianRupee, Leaf, Mountain, Home, Shield, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Economic data
  const economicData = [
    { name: 'Major Forest Produce', value: 48.49, color: '#8884d8', description: 'Sal, Teak, Bamboo, Other Timbers' },
    { name: 'Minor Forest Produce', value: 12.5, color: '#82ca9d', description: 'Kendu leaves, Honey, Fruits, Medicinal plants' }
  ];

  // Detailed product breakdown for stacked chart
  const detailedProductData = [
    {
      category: 'Major Forest Produce',
      'Sal Timber': 18.5,
      'Teak Timber': 14.2,
      'Bamboo': 10.8,
      'Other Commercial Timber': 4.99,
      total: 48.49
    },
    {
      category: 'Minor Forest Produce', 
      'Kendu Leaves': 4.2,
      'Honey & Bee Products': 2.8,
      'Medicinal Plants': 2.1,
      'Wild Fruits': 1.9,
      'Resins & Grasses': 1.5,
      total: 12.5
    }
  ];

  const ecosystemBreakdown = [
    { name: 'Water Provisioning', value: 1580, color: '#0088FE' },
    { name: 'Climate Regulation', value: 2108, color: '#00C49F' },
    { name: 'Carbon Sequestration', value: 1897, color: '#FFBB28' },
    { name: 'Biodiversity Conservation', value: 738, color: '#FF8042' }
  ];

  const relocationData = [
    { year: '2019-2020', families: 200, amount: 40 },
    { year: '2020-2021', families: 156, amount: 31.2 },
    { year: '2021-2022', families: 206, amount: 41.2 },
    { year: '2022-2023', families: 112, amount: 22.4 }
  ];

  const areaDistribution = [
    { name: 'Core Area', value: 523.61, color: '#2E8B57' },
    { name: 'Buffer Area', value: 440.26, color: '#90EE90' },
    { name: 'Total Reserve', value: 963.87, color: '#006400' }
  ];

  // Helpers to render each section so we can reuse for the "all" view
  const renderOverview = () => (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Key Stats Cards */}
            <div className="xl:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg text-white border border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Area</p>
                    <p className="text-2xl font-bold">96,387 ha</p>
                  </div>
                  <Mountain className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 rounded-lg text-white border border-indigo-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Districts</p>
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-xs text-indigo-200">Angul, Nayagarh, Cuttack, Boudh</p>
                  </div>
                  <MapPin className="h-8 w-8 text-indigo-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4 rounded-lg text-white border border-slate-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-100 text-sm">Families Relocated</p>
                    <p className="text-2xl font-bold">674</p>
                  </div>
                  <Users className="h-8 w-8 text-slate-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 rounded-lg text-white border border-cyan-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm">Established</p>
                    <p className="text-2xl font-bold">2007</p>
                    <p className="text-xs text-cyan-200">Tiger Reserve Status</p>
                  </div>
                  <Calendar className="h-8 w-8 text-cyan-200" />
                </div>
              </div>
            </div>

            {/* Area Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Area Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={areaDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${value} km²`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {areaDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} km²`, 'Area']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Key Information */}
            <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <TreePine className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Primary Vegetation</p>
                      <p className="text-sm text-gray-600">Deciduous forests along Mahanadi River</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Main Tribes</p>
                      <p className="text-sm text-gray-600">Madia Gond, Kondh communities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Legal Status</p>
                      <p className="text-sm text-gray-600">Fifth Schedule Area, PESA applicable</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mountain className="h-5 w-5 text-gray-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Geography</p>
                      <p className="text-sm text-gray-600">14 miles length Mahanadi gorge</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Home className="h-5 w-5 text-red-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Villages Relocated</p>
                      <p className="text-sm text-gray-600">6 completed, 3 more willing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <IndianRupee className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-800">Compensation</p>
                      <p className="text-sm text-gray-600">₹15-20 lakh per family</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );

  const renderEconomics = () => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Total Economic Value */}
            <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg text-white mb-6 border border-blue-500">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Total Annual Economic Value</h2>
                <p className="text-5xl font-bold">₹61 Crore</p>
                <p className="text-lg mt-2">Direct forest produce value</p>
              </div>
            </div>

            {/* Economic Breakdown - Stacked */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Forest Produce Value Breakdown</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={detailedProductData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`₹${value} Crore`, name]}
                    labelFormatter={(label) => `${label} Products`}
                  />
                  {/* Major Forest Produce bars */}
                  <Bar dataKey="Sal Timber" stackId="a" fill="#1f77b4" />
                  <Bar dataKey="Teak Timber" stackId="a" fill="#ff7f0e" />
                  <Bar dataKey="Bamboo" stackId="a" fill="#2ca02c" />
                  <Bar dataKey="Other Commercial Timber" stackId="a" fill="#d62728" />
                  {/* Minor Forest Produce bars */}
                  <Bar dataKey="Kendu Leaves" stackId="a" fill="#9467bd" />
                  <Bar dataKey="Honey & Bee Products" stackId="a" fill="#8c564b" />
                  <Bar dataKey="Medicinal Plants" stackId="a" fill="#e377c2" />
                  <Bar dataKey="Wild Fruits" stackId="a" fill="#7f7f7f" />
                  <Bar dataKey="Resins & Grasses" stackId="a" fill="#bcbd22" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Sal Timber</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Teak Timber</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-600 rounded"></div>
                  <span>Bamboo</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-600 rounded"></div>
                  <span>Other Timber</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-600 rounded"></div>
                  <span>Kendu Leaves</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-700 rounded"></div>
                  <span>Honey & Bee</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-pink-500 rounded"></div>
                  <span>Medicinal Plants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span>Wild Fruits</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Resins & Grasses</span>
                </div>
              </div>
            </div>

            {/* Forest Products Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Forest Produce Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={economicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ₹${value}Cr`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {economicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value} Crore`, 'Value']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Forest Products Details */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Detailed Product Valuation</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Major Forest Produce (₹48.49 Cr)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">• Sal timber</span>
                      <span className="font-medium text-blue-800">₹18.5 Cr (38%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">• Teak timber</span>
                      <span className="font-medium text-blue-800">₹14.2 Cr (29%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">• Bamboo</span>
                      <span className="font-medium text-blue-800">₹10.8 Cr (22%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">• Other commercial timber</span>
                      <span className="font-medium text-blue-800">₹5.0 Cr (10%)</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <span className="text-lg font-bold text-blue-800">79.5% of total forest produce</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">Minor Forest Produce (₹12.5 Cr)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">• Kendu leaves</span>
                      <span className="font-medium text-green-800">₹4.2 Cr (34%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">• Honey & bee products</span>
                      <span className="font-medium text-green-800">₹2.8 Cr (22%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">• Medicinal plants</span>
                      <span className="font-medium text-green-800">₹2.1 Cr (17%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">• Wild fruits</span>
                      <span className="font-medium text-green-800">₹1.9 Cr (15%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-green-700">• Resins & grasses</span>
                      <span className="font-medium text-green-800">₹1.5 Cr (12%)</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-green-200">
                    <span className="text-lg font-bold text-green-800">20.5% of total forest produce</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> The above values are estimated based on typical forest product valuations and may require verification with official forest department records for exact figures.
                </p>
              </div>
            </div>
          </div>
  );

  const renderPopulation = () => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Relocation Progress */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Family Relocation Progress</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={relocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area yAxisId="left" type="monotone" dataKey="families" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-800">Total Families Relocated</p>
                  <p className="text-2xl font-bold text-blue-600">674</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-800">Total Compensation</p>
                  <p className="text-2xl font-bold text-green-600">₹134.8 Cr</p>
                </div>
              </div>
            </div>

            {/* Tribal Communities */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Tribal Communities</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-800">Madia Gond</h4>
                  <p className="text-sm text-gray-600">Primary tribal community in the region</p>
                  <p className="text-xs text-gray-500">Traditional forest dwellers with deep cultural ties</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-800">Kondh Communities</h4>
                  <p className="text-sm text-gray-600">Indigenous tribal group</p>
                  <p className="text-xs text-gray-500">Known for traditional forest conservation practices</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded mt-4">
                  <p className="text-sm text-yellow-800"><strong>Note:</strong> Exact population figures require official tribal census data</p>
                </div>
              </div>
            </div>

            {/* Relocation Details */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Relocation Program</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Villages Relocated</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">6 Complete</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Villages Willing</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">3 More</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Compensation Package</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">₹15-20L/family</span>
                </div>
                <div className="bg-blue-50 p-3 rounded mt-4">
                  <p className="text-sm text-blue-800"><strong>Recent:</strong> 112 families from Tuluka and Asanbahal relocated to Dhauragotha in 2023</p>
                </div>
              </div>
            </div>

            {/* Administrative Status */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Administrative & Legal Framework</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Fifth Schedule Area</h4>
                  <p className="text-sm text-red-700">Special constitutional protection for tribal areas</p>
                  <p className="text-xs text-red-600 mt-1">Enhanced tribal rights and governance</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">PESA Act Applicable</h4>
                  <p className="text-sm text-green-700">Panchayats Extension to Scheduled Areas</p>
                  <p className="text-xs text-green-600 mt-1">Local self-governance for tribal areas</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Gram Panchayats</h4>
                  <p className="text-sm text-blue-700">Multiple GPs across 4 districts</p>
                  <p className="text-xs text-blue-600 mt-1">Detailed mapping required</p>
                </div>
              </div>
            </div>
          </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverview();
      case 'economics':
        return renderEconomics();
      case 'population':
        return renderPopulation();
      case 'all':
        return (
          <>
            {renderOverview()}
            <div className="my-8" />
            {renderEconomics()}
            <div className="my-8" />
            {renderPopulation()}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Satkosia Tiger Reserve</h1>
          <p className="text-lg">Government of India - Ministry of Environment, Forest & Climate Change</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded border border-white/30">📍 4 Districts: Angul, Nayagarh, Cuttack, Boudh</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded border border-white/30">🏛️ Established: 2007 (Tiger Reserve)</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded border border-white/30">🌊 Mahanadi River Gorge</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8">
            {[
              { id: 'all', label: 'All', icon: Home },
              { id: 'overview', label: 'Overview', icon: Mountain },
              { id: 'economics', label: 'Economic Valuation', icon: IndianRupee },
              { id: 'population', label: 'Population & Tribes', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="bg-slate-700 text-white p-6 mt-8 border-t-4 border-blue-600">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm">Government of India - Ministry of Environment, Forest & Climate Change</p>
          <p className="text-xs text-gray-300 mt-2">Data compiled from official sources, forest department reports, and research studies</p>
          <p className="text-xs text-gray-400 mt-1">Note: Some data requires verification from official records for complete accuracy</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;