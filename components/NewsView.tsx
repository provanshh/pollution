import React, { useState } from 'react';
import { Ward } from '../types';
import { Newspaper, Calendar, MapPin, ArrowRight, CloudRain, Zap, FileText, AlertTriangle, TrendingUp, Filter, HeartPulse } from 'lucide-react';

interface NewsViewProps {
  wards: Ward[];
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Local' | 'Policy' | 'Weather' | 'Health';
  location?: string; // Specific ward or 'City-wide'
  timestamp: string;
  imageUrl?: string;
  source: string;
  isBreaking?: boolean;
}

const NewsView: React.FC<NewsViewProps> = ({ wards }) => {
  const [filter, setFilter] = useState<'All' | 'Local' | 'Policy' | 'Weather' | 'Health'>('All');

  const newsData: NewsItem[] = [
    {
      id: '1',
      title: 'GRAP Stage-3 Implemented Across Delhi NCR as AQI Breaches 400',
      summary: 'Due to severe deterioration in air quality, the Commission for Air Quality Management (CAQM) has invoked Stage-3 of the Graded Response Action Plan. All construction work is halted immediately.',
      category: 'Policy',
      location: 'City-wide',
      timestamp: '1 hour ago',
      source: 'Central Pollution Control Board',
      isBreaking: true,
      imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '2',
      title: 'Doctors Warn: 40% Rise in Respiratory Cases in OPDs',
      summary: 'Major hospitals in Delhi report a surge in patients complaining of breathlessness and burning eyes. Pulmonologists advise N95 masks for outdoor commute.',
      category: 'Health',
      location: 'Delhi',
      timestamp: '2 hours ago',
      source: 'Health Ministry',
      imageUrl: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '3',
      title: 'Connaught Place (CP) Installs New Smog Towers Near Inner Circle',
      summary: 'In a bid to control localized vehicular pollution, NDMC has operationalized two new medium-range smog towers. Early data shows a 15% drop in PM2.5 levels in the immediate vicinity.',
      category: 'Local',
      location: 'Connaught Place, New Delhi',
      timestamp: '3 hours ago',
      source: 'Municipal Updates',
      imageUrl: 'https://images.unsplash.com/photo-1555679465-b1a92ceac449?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '4',
      title: 'Shahdara Residents Report Spike in Waste Burning Incidents',
      summary: 'Citizen reports from East Delhi indicate a rise in illegal garbage burning at night. Local ward officers have formed night-patrol teams to curb these violations.',
      category: 'Local',
      location: 'Shahdara, Delhi',
      timestamp: '5 hours ago',
      source: 'Citizen Watch',
      imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '5',
      title: 'Weather Alert: Low Wind Speeds to Persist for Next 48 Hours',
      summary: 'Meteorological department predicts wind speeds below 5km/h, leading to "Very Poor" dispersion conditions. Pollutants are likely to accumulate near the surface.',
      category: 'Weather',
      location: 'North India Region',
      timestamp: 'Yesterday',
      source: 'IMD Forecast',
      imageUrl: 'https://images.unsplash.com/photo-1561553873-e8491a564fd0?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '6',
      title: 'Odd-Even Scheme Under Consideration if AQI Crosses 450',
      summary: 'Transport Department sources suggest that if the average city AQI remains in the "Severe+" category for 3 consecutive days, the Odd-Even vehicle rationing scheme may be reintroduced.',
      category: 'Policy',
      location: 'City-wide',
      timestamp: 'Yesterday',
      source: 'Transport Dept',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '7',
      title: 'Rohini Sector-18 Recognized as "Model Clean Air Zone"',
      summary: 'Through strict enforcement of dust control norms and community participation, Rohini Sector-18 has maintained "Moderate" air quality despite neighboring areas hitting "Poor".',
      category: 'Local',
      location: 'Rohini, Delhi',
      timestamp: '2 days ago',
      source: 'EcoWard Analysis',
      imageUrl: 'https://images.unsplash.com/photo-1496307653780-42ee777d480d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '8',
      title: 'New Electric Bus Fleet Flagged Off in South Delhi',
      summary: 'DTC adds 50 new electric buses to the South Delhi route to reduce diesel emissions. Commuters praise the noise-free and clean ride.',
      category: 'Policy',
      location: 'South Delhi',
      timestamp: '3 days ago',
      source: 'Transport Ministry',
      imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '9',
      title: 'Construction Ban: 50 Sites Fined for Violations',
      summary: 'Enforcement teams have levied heavy fines on construction sites operating without anti-smog guns and dust barriers in violation of GRAP rules.',
      category: 'Policy',
      location: 'Noida & Ghaziabad',
      timestamp: '3 days ago',
      source: 'Pollution Control Board',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '10',
      title: 'School Timings Changed Due to Morning Smog',
      summary: 'Considering the hazardous air quality in the early hours, schools across the capital have been advised to delay opening time to 9 AM.',
      category: 'Health',
      location: 'Delhi NCR',
      timestamp: '4 days ago',
      source: 'Education Dept',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '11',
      title: 'Yamuna Froth Levels Rise Affecting Water Treatment',
      summary: 'High ammonia levels and toxic froth observed in the Yamuna river. Water supply in parts of Central Delhi may be affected.',
      category: 'Local',
      location: 'Okhla Barrage',
      timestamp: '4 days ago',
      source: 'Jal Board',
      imageUrl: 'https://images.unsplash.com/photo-1617112837554-20b3806be44d?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '12',
      title: 'Drone Monitoring Started in Industrial Zones',
      summary: 'High-tech surveillance drones deployed to identify factories emitting dark smoke and bypassing filtration systems.',
      category: 'Policy',
      location: 'Industrial Areas',
      timestamp: '5 days ago',
      source: 'Tech Watch',
      imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '13',
      title: 'Artificial Rain Experiment Scheduled for Next Week',
      summary: 'IIT Kanpur proposes cloud seeding experiment to induce artificial rain and wash away pollutants, pending government approval.',
      category: 'Weather',
      location: 'Kanpur / Delhi',
      timestamp: '5 days ago',
      source: 'Science & Tech',
      imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '14',
      title: 'Air Purifier Sales Spike by 300% in One Week',
      summary: 'With AQI hitting severe levels, retailers report a massive surge in demand for indoor air purifiers and fresh air systems.',
      category: 'Health',
      location: 'Market Report',
      timestamp: '6 days ago',
      source: 'Business News',
      imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf79dd6903e7?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '15',
      title: 'Traffic Police Issue 2000+ Challans for PUC Violations',
      summary: 'Intensive drive launched to check Pollution Under Control (PUC) certificates. Vehicles without valid certificates face steep fines.',
      category: 'Policy',
      location: 'Major Intersections',
      timestamp: '1 week ago',
      source: 'Traffic Police',
      imageUrl: 'https://images.unsplash.com/photo-1605218457336-928d29a531e2?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '16',
      title: 'Illegal Waste Dumping Site Found in Dwarka',
      summary: 'Residents alert authorities about a massive unauthorized dumping ground causing foul smell and dust. Clean-up ordered.',
      category: 'Local',
      location: 'Dwarka Sec-8',
      timestamp: '1 week ago',
      source: 'Citizen Report',
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '17',
      title: 'Green War Room Active 24/7 to Monitor Hotspots',
      summary: 'A dedicated control room with 150 screens is tracking pollution data from all sensors to coordinate rapid response teams.',
      category: 'Policy',
      location: 'Secretariat',
      timestamp: '1 week ago',
      source: 'Govt Official',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '18',
      title: 'Study Links High Pollution to Sleep Disorders',
      summary: 'New research suggests long-term exposure to PM2.5 can disrupt sleep patterns and lead to chronic insomnia.',
      category: 'Health',
      location: 'Global Study',
      timestamp: '1 week ago',
      source: 'Medical Journal',
      imageUrl: 'https://images.unsplash.com/photo-1541781777621-af1391e9a705?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '19',
      title: 'Metro Frequency Increased to Reduce Private Vehicles',
      summary: 'DMRC adds 40 extra trips daily to accommodate more passengers and encourage public transport usage during peak pollution season.',
      category: 'Policy',
      location: 'Metro Network',
      timestamp: '8 days ago',
      source: 'DMRC',
      imageUrl: 'https://images.unsplash.com/photo-1554523908-163e7c81d34c?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: '20',
      title: 'Stubble Burning Incidents Drop by 20% in Punjab',
      summary: 'Satellite data shows a reduction in farm fires compared to last year, thanks to new bio-decomposer technology distribution.',
      category: 'Local',
      location: 'Punjab / Haryana',
      timestamp: '8 days ago',
      source: 'ISRO Data',
      imageUrl: 'https://images.unsplash.com/photo-1628198758839-86c4765d1d6a?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const filteredNews = filter === 'All' ? newsData : newsData.filter(item => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Newspaper className="text-blue-600" size={32} /> Pollution News & Policy Hub
          </h1>
          <p className="text-slate-500 mt-1">Real-time updates on air quality, governance actions, and local ward reports.</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            <Filter size={16} className="text-slate-400 ml-2 mr-2 shrink-0" />
            {['All', 'Local', 'Policy', 'Weather', 'Health'].map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-3 py-1.5 text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                        filter === cat 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* Breaking News Banner (if any) */}
            {newsData.some(n => n.isBreaking) && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-4 shadow-sm animate-in slide-in-from-top-2">
                    <div className="bg-red-100 p-2 rounded-full shrink-0">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Breaking Alert</div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">
                            {newsData.find(n => n.isBreaking)?.title}
                        </h2>
                        <p className="text-slate-700 mt-2 text-sm leading-relaxed">
                             {newsData.find(n => n.isBreaking)?.summary}
                        </p>
                    </div>
                </div>
            )}

            {/* News List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredNews.filter(n => !n.isBreaking).map((news) => (
                    <div key={news.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col md:flex-row gap-6">
                        {/* Image Placeholder (Dynamic) */}
                        <div className="w-full md:w-48 h-32 rounded-lg shrink-0 overflow-hidden relative bg-slate-100 border border-slate-100">
                             {news.imageUrl ? (
                                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                                <div className={`w-full h-full flex items-center justify-center ${
                                    news.category === 'Policy' ? 'bg-purple-100' :
                                    news.category === 'Weather' ? 'bg-blue-100' :
                                    news.category === 'Local' ? 'bg-amber-100' : 
                                    news.category === 'Health' ? 'bg-red-100' : 'bg-slate-100'
                                }`}>
                                    {news.category === 'Policy' && <FileText className="text-purple-400" size={40} />}
                                    {news.category === 'Weather' && <CloudRain className="text-blue-400" size={40} />}
                                    {news.category === 'Local' && <MapPin className="text-amber-400" size={40} />}
                                    {news.category === 'Health' && <HeartPulse className="text-red-400" size={40} />}
                                </div>
                             )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                                     news.category === 'Policy' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                     news.category === 'Weather' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                     news.category === 'Health' ? 'bg-red-50 text-red-700 border-red-100' :
                                     'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                    {news.category}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar size={12} /> {news.timestamp}
                                </span>
                            </div>
                            
                            <h3 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                                {news.title}
                            </h3>
                            
                            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                                {news.summary}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto">
                                <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                                    <MapPin size={12} /> {news.location}
                                </div>
                                <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Read Full Story <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Load More Trigger (Visual) */}
            <div className="text-center py-6">
                <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    Load Older News
                </button>
            </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Stats Widget */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-blue-400"/> Ward Watch
                </h3>
                <div className="space-y-4 relative z-10">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span>Anand Vihar</span>
                        <span className="font-mono font-bold text-red-400">412 AQI</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span>Punjabi Bagh</span>
                        <span className="font-mono font-bold text-red-400">389 AQI</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span>Lodhi Road</span>
                        <span className="font-mono font-bold text-orange-400">265 AQI</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Pusa</span>
                        <span className="font-mono font-bold text-orange-400">240 AQI</span>
                    </div>
                </div>
            </div>

            {/* Official Notices */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-slate-500"/> Official Bulletins
                </h3>
                <ul className="space-y-4">
                    <li className="text-sm">
                        <div className="font-semibold text-slate-700">Public Advisory - CAQM</div>
                        <p className="text-slate-500 text-xs mt-1">Citizens urged to use public transport. Diesel generator sets banned.</p>
                    </li>
                    <li className="text-sm border-t border-slate-100 pt-3">
                        <div className="font-semibold text-slate-700">Health Dept Notification</div>
                        <p className="text-slate-500 text-xs mt-1">Masks recommended for elderly and children during morning hours.</p>
                    </li>
                     <li className="text-sm border-t border-slate-100 pt-3">
                        <div className="font-semibold text-slate-700">School Holiday Update</div>
                        <p className="text-slate-500 text-xs mt-1">Primary schools to operate online until further notice.</p>
                    </li>
                </ul>
            </div>

             {/* Newsletter Subscribe */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 text-center">
                <h3 className="font-bold text-blue-900 mb-2">Get Daily Air Alerts</h3>
                <p className="text-xs text-blue-700 mb-4">Subscribe to ward-specific updates directly to your inbox.</p>
                <div className="flex gap-2">
                    <input type="email" placeholder="Email Address" className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">Go</button>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default NewsView;