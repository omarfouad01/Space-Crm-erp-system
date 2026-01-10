import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Settings,
  RefreshCw,
  ChevronRight,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Rocket,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  created_at: string;
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  enabled: boolean;
  executions: number;
  lastRun?: string;
}

interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'deal' | 'client' | 'exhibition' | 'marketing';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  timeToImplement: string;
}

export default function AdvancedFeatures() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');

  // Mock data
  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'opportunity',
      title: 'High-Value Deal Opportunity Detected',
      description: 'EcoTech Solutions shows 85% likelihood of upgrading to premium sponsorship package based on engagement patterns.',
      confidence: 85,
      impact: 'high',
      category: 'Sales',
      actionable: true,
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Client Churn Risk Alert',
      description: 'Innovation Corp has decreased engagement by 40% over the past month. Immediate attention recommended.',
      confidence: 78,
      impact: 'high',
      category: 'Client Management',
      actionable: true,
      created_at: '2024-01-10T09:30:00Z'
    },
    {
      id: '3',
      type: 'prediction',
      title: 'Q2 Revenue Forecast',
      description: 'Based on current pipeline and historical data, Q2 revenue is projected to exceed target by 12%.',
      confidence: 92,
      impact: 'medium',
      category: 'Finance',
      actionable: false,
      created_at: '2024-01-10T08:15:00Z'
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Optimal Exhibition Timing',
      description: 'March 15-17 shows highest potential attendance based on industry calendar analysis and competitor events.',
      confidence: 89,
      impact: 'medium',
      category: 'Exhibition Planning',
      actionable: true,
      created_at: '2024-01-10T07:45:00Z'
    }
  ];

  const mockAutomations: AutomationRule[] = [
    {
      id: '1',
      name: 'Lead Scoring & Assignment',
      description: 'Automatically score new leads and assign to appropriate sales team members',
      trigger: 'New lead created',
      action: 'Score lead and assign to sales rep',
      enabled: true,
      executions: 156,
      lastRun: '2024-01-10T11:30:00Z'
    },
    {
      id: '2',
      name: 'Follow-up Reminders',
      description: 'Send automated follow-up reminders for deals inactive for 3+ days',
      trigger: 'Deal inactive for 3 days',
      action: 'Send reminder to assigned sales rep',
      enabled: true,
      executions: 89,
      lastRun: '2024-01-10T10:15:00Z'
    },
    {
      id: '3',
      name: 'Contract Expiration Alerts',
      description: 'Notify account managers 30 days before contract expiration',
      trigger: '30 days before contract expiry',
      action: 'Send renewal reminder email',
      enabled: true,
      executions: 23,
      lastRun: '2024-01-09T16:00:00Z'
    },
    {
      id: '4',
      name: 'Exhibition Capacity Monitoring',
      description: 'Alert when exhibition reaches 80% capacity',
      trigger: 'Exhibition 80% full',
      action: 'Send capacity alert to event team',
      enabled: false,
      executions: 12,
      lastRun: '2024-01-08T14:20:00Z'
    }
  ];

  const mockRecommendations: SmartRecommendation[] = [
    {
      id: '1',
      title: 'Implement Dynamic Pricing',
      description: 'Use AI-driven dynamic pricing for booth rentals based on demand, location, and timing to increase revenue by 15-20%.',
      type: 'exhibition',
      priority: 'high',
      estimatedImpact: '+$125,000 annual revenue',
      timeToImplement: '2-3 weeks'
    },
    {
      id: '2',
      title: 'Personalized Client Communications',
      description: 'Deploy AI-powered email personalization to improve client engagement and response rates.',
      type: 'marketing',
      priority: 'medium',
      estimatedImpact: '+25% email engagement',
      timeToImplement: '1-2 weeks'
    },
    {
      id: '3',
      title: 'Predictive Deal Scoring',
      description: 'Implement machine learning model to predict deal closure probability and optimize sales efforts.',
      type: 'deal',
      priority: 'high',
      estimatedImpact: '+18% win rate',
      timeToImplement: '3-4 weeks'
    },
    {
      id: '4',
      title: 'Automated Client Health Monitoring',
      description: 'Set up real-time client health scoring to proactively identify at-risk accounts.',
      type: 'client',
      priority: 'medium',
      estimatedImpact: '-30% churn rate',
      timeToImplement: '2-3 weeks'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInsights(mockInsights);
      setAutomations(mockAutomations);
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return Target;
      case 'risk': return AlertTriangle;
      case 'recommendation': return Lightbulb;
      case 'prediction': return TrendingUp;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'text-green-600 bg-green-100';
      case 'risk': return 'text-red-600 bg-red-100';
      case 'recommendation': return 'text-blue-600 bg-blue-100';
      case 'prediction': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleAutomation = (id: string) => {
    setAutomations(prev => prev.map(automation => 
      automation.id === id 
        ? { ...automation, enabled: !automation.enabled }
        : automation
    ));
  };

  if (loading) {
    return (
      <div className="content-area">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading AI features...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              Advanced AI Features
            </h1>
            <p className="text-gray-600 mt-2">AI-powered insights, automation, and intelligent recommendations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure AI
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Insights
            </Button>
          </div>
        </div>

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-200 rounded-full w-fit mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">AI Insights</h3>
              <p className="text-sm text-blue-700">Smart analysis and predictions</p>
              <p className="text-2xl font-bold text-blue-900 mt-2">{insights.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-200 rounded-full w-fit mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Automations</h3>
              <p className="text-sm text-green-700">Workflow automation rules</p>
              <p className="text-2xl font-bold text-green-900 mt-2">{automations.filter(a => a.enabled).length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-200 rounded-full w-fit mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Recommendations</h3>
              <p className="text-sm text-purple-700">Smart suggestions</p>
              <p className="text-2xl font-bold text-purple-900 mt-2">{recommendations.length}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-200 rounded-full w-fit mx-auto mb-4">
                <Rocket className="w-6 h-6 text-orange-700" />
              </div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Performance</h3>
              <p className="text-sm text-orange-700">AI-driven improvements</p>
              <p className="text-2xl font-bold text-orange-900 mt-2">+24%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'insights', label: 'AI Insights', icon: Brain },
              { id: 'automations', label: 'Automations', icon: Zap },
              { id: 'recommendations', label: 'Recommendations', icon: Lightbulb }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                const colorClass = getInsightColor(insight.type);
                
                return (
                  <Card key={insight.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                            <Badge className={getPriorityColor(insight.impact)}>
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Confidence:</span>
                                <div className="flex items-center gap-1">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${insight.confidence}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{insight.confidence}%</span>
                                </div>
                              </div>
                              <Badge variant="outline">{insight.category}</Badge>
                            </div>
                            {insight.actionable && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Take Action
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-6">
            {automations.map((automation) => (
              <Card key={automation.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${automation.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                          <Badge variant={automation.enabled ? "default" : "secondary"}>
                            {automation.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{automation.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Trigger:</span>
                            <p className="font-medium text-gray-900">{automation.trigger}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Action:</span>
                            <p className="font-medium text-gray-900">{automation.action}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Executions:</span>
                            <p className="font-medium text-gray-900">{automation.executions}</p>
                          </div>
                        </div>
                        {automation.lastRun && (
                          <p className="text-xs text-gray-500 mt-2">
                            Last run: {new Date(automation.lastRun).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Switch
                        checked={automation.enabled}
                        onCheckedChange={() => toggleAutomation(automation.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{recommendation.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Estimated Impact:</span>
                            <span className="font-medium text-green-600">{recommendation.estimatedImpact}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Time to Implement:</span>
                            <span className="font-medium text-gray-900">{recommendation.timeToImplement}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Category:</span>
                            <Badge variant="outline">{recommendation.type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Implement
                          </Button>
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}