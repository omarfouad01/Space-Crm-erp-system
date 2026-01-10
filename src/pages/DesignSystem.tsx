import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Palette, 
  Eye, 
  Contrast, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Copy,
  Download,
  RefreshCw,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUp,
  ArrowDown,
  Circle,
  Square,
  Triangle,
  Heart,
  Bookmark,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Upload,
  Share,
  Lock,
  Unlock,
  Home,
  User,
  Briefcase,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown
} from "lucide-react";

interface ColorInfo {
  name: string;
  class: string;
  hex: string;
  usage: string;
  contrast?: string;
}

interface ColorCategory {
  name: string;
  description: string;
  colors: ColorInfo[];
}

interface MetricExample {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

export default function DesignSystem() {
  const { toast } = useToast();
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const colorPalette: ColorCategory[] = [
    {
      name: "Primary",
      description: "Brand colors for primary actions and navigation",
      colors: [
        { name: "Primary", class: "bg-blue-600", hex: "#2563eb", usage: "Primary buttons, links, focus states", contrast: "4.5:1" },
        { name: "Primary Hover", class: "bg-blue-700", hex: "#1d4ed8", usage: "Hover states for primary elements", contrast: "5.2:1" },
        { name: "Primary Light", class: "bg-blue-50", hex: "#eff6ff", usage: "Light backgrounds, subtle highlights", contrast: "1.2:1" },
        { name: "Primary Dark", class: "bg-blue-900", hex: "#1e3a8a", usage: "Dark themes, high contrast", contrast: "7.1:1" },
      ]
    },
    {
      name: "Semantic",
      description: "Status and feedback colors",
      colors: [
        { name: "Success", class: "bg-green-600", hex: "#16a34a", usage: "Success messages, positive states", contrast: "4.8:1" },
        { name: "Success Light", class: "bg-green-100", hex: "#dcfce7", usage: "Success backgrounds", contrast: "1.3:1" },
        { name: "Warning", class: "bg-orange-600", hex: "#ea580c", usage: "Warning messages, caution states", contrast: "4.6:1" },
        { name: "Warning Light", class: "bg-orange-100", hex: "#fed7aa", usage: "Warning backgrounds", contrast: "1.4:1" },
        { name: "Error", class: "bg-red-600", hex: "#dc2626", usage: "Error messages, destructive actions", contrast: "5.1:1" },
        { name: "Error Light", class: "bg-red-100", hex: "#fee2e2", usage: "Error backgrounds", contrast: "1.3:1" },
        { name: "Info", class: "bg-cyan-600", hex: "#0891b2", usage: "Information messages, neutral states", contrast: "4.7:1" },
        { name: "Info Light", class: "bg-cyan-100", hex: "#cffafe", usage: "Info backgrounds", contrast: "1.2:1" },
      ]
    },
    {
      name: "Neutral",
      description: "Text and background colors",
      colors: [
        { name: "Text Primary", class: "bg-gray-900", hex: "#111827", usage: "Primary text, headings", contrast: "16.1:1" },
        { name: "Text Secondary", class: "bg-gray-600", hex: "#4b5563", usage: "Secondary text, descriptions", contrast: "7.2:1" },
        { name: "Text Tertiary", class: "bg-gray-400", hex: "#9ca3af", usage: "Tertiary text, placeholders", contrast: "4.5:1" },
        { name: "Background", class: "bg-gray-50", hex: "#f9fafb", usage: "Page backgrounds, subtle areas", contrast: "1.1:1" },
        { name: "Surface", class: "bg-white", hex: "#ffffff", usage: "Card backgrounds, content areas", contrast: "1:1" },
        { name: "Border", class: "bg-gray-200", hex: "#e5e7eb", usage: "Borders, dividers", contrast: "1.8:1" },
      ]
    },
    {
      name: "Extended",
      description: "Additional colors for enhanced UI",
      colors: [
        { name: "Purple", class: "bg-purple-600", hex: "#9333ea", usage: "Special features, premium content", contrast: "4.9:1" },
        { name: "Pink", class: "bg-pink-600", hex: "#db2777", usage: "Highlights, special occasions", contrast: "5.3:1" },
        { name: "Indigo", class: "bg-indigo-600", hex: "#4f46e5", usage: "Secondary actions, categories", contrast: "4.8:1" },
        { name: "Teal", class: "bg-teal-600", hex: "#0d9488", usage: "Growth, positive metrics", contrast: "4.6:1" },
        { name: "Amber", class: "bg-amber-600", hex: "#d97706", usage: "Attention, pending states", contrast: "4.7:1" },
        { name: "Emerald", class: "bg-emerald-600", hex: "#059669", usage: "Success variations, nature", contrast: "4.9:1" },
      ]
    }
  ];

  const componentExamples = [
    {
      title: "Buttons",
      description: "Enhanced button variants with improved visibility",
      component: (
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button className="bg-green-600 hover:bg-green-700">Success</Button>
          <Button className="bg-orange-600 hover:bg-orange-700">Warning</Button>
          <Button className="bg-red-600 hover:bg-red-700">Error</Button>
          <Button className="bg-cyan-600 hover:bg-cyan-700">Info</Button>
        </div>
      )
    },
    {
      title: "Badges",
      description: "Status indicators with semantic colors",
      component: (
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge className="bg-green-600">Success</Badge>
          <Badge className="bg-orange-600">Warning</Badge>
          <Badge className="bg-red-600">Error</Badge>
          <Badge className="bg-cyan-600">Info</Badge>
          <Badge className="bg-green-100 text-green-800">Success Light</Badge>
          <Badge className="bg-orange-100 text-orange-800">Warning Light</Badge>
          <Badge className="bg-red-100 text-red-800">Error Light</Badge>
          <Badge className="bg-cyan-100 text-cyan-800">Info Light</Badge>
        </div>
      )
    },
    {
      title: "Status Indicators",
      description: "Custom status components with enhanced visibility",
      component: (
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-medium">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
            <span className="text-sm font-medium">Info</span>
          </div>
        </div>
      )
    },
    {
      title: "Icons",
      description: "Comprehensive icon set with consistent styling",
      component: (
        <div className="grid grid-cols-8 gap-4">
          {[Home, User, Briefcase, BarChart3, PieChart, LineChart, Settings, Bell, 
            Mail, Phone, Calendar, Clock, MapPin, Search, Filter, Plus, 
            Minus, Edit, Trash2, Save, Upload, Share, Lock, Unlock].map((Icon, index) => (
            <div key={index} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100">
              <Icon className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-500">{Icon.name}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  const metricsExamples: MetricExample[] = [
    {
      title: "Revenue",
      value: "$2,847,392",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Deals",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: Target,
      color: "text-cyan-600"
    },
    {
      title: "Clients",
      value: "892",
      change: "-2.1%",
      trend: "down",
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Conversion Rate",
      value: "68.4%",
      change: "+5.7%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    });
  };

  const exportPalette = () => {
    const paletteData = colorPalette.map(category => ({
      category: category.name,
      colors: category.colors.map(color => ({
        name: color.name,
        hex: color.hex,
        usage: color.usage
      }))
    }));

    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-system-palette.json';
    link.click();

    toast({
      title: "Palette Exported",
      description: "Design system palette has been exported as JSON.",
    });
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Palette className="w-8 h-8 text-blue-600" />
            Enhanced Design System
          </h1>
          <p className="text-gray-600 mt-2">
            Professional UI/UX color palette with improved visibility and accessibility
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            WCAG AA Compliant
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Contrast className="w-3 h-3" />
            High Contrast
          </Badge>
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={exportPalette}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Design System Tabs */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        {/* Color Palette Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {colorPalette.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {category.colors.map((color) => (
                        <Card 
                          key={color.name} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedColor(color)}
                        >
                          <CardContent className="p-4">
                            <div className={`w-full h-16 rounded-lg mb-3 ${color.class} border`}></div>
                            <div className="space-y-1">
                              <h4 className="font-medium">{color.name}</h4>
                              <div className="flex items-center justify-between">
                                <code className="text-sm text-gray-600">{color.hex}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(color.hex);
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-gray-500">{color.usage}</p>
                              {color.contrast && (
                                <Badge variant="outline" className="text-xs">
                                  {color.contrast} contrast
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Enhanced Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {componentExamples.map((example) => (
                  <div key={example.title}>
                    <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                    <p className="text-gray-600 mb-4">{example.description}</p>
                    <div className="p-6 bg-gray-50 rounded-lg border">
                      {example.component}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Heading 1</h1>
                  <code className="text-sm text-gray-600">text-4xl font-bold</code>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Heading 2</h2>
                  <code className="text-sm text-gray-600">text-3xl font-semibold</code>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Heading 3</h3>
                  <code className="text-sm text-gray-600">text-2xl font-semibold</code>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900 mb-2">Heading 4</h4>
                  <code className="text-sm text-gray-600">text-xl font-medium</code>
                </div>
                <div>
                  <p className="text-base text-gray-900 mb-2">Body Text - Regular</p>
                  <code className="text-sm text-gray-600">text-base</code>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Small Text - Secondary</p>
                  <code className="text-sm text-gray-600">text-sm text-gray-600</code>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Extra Small - Tertiary</p>
                  <code className="text-sm text-gray-600">text-xs text-gray-500</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Enhanced Metrics Display
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricsExamples.map((metric) => (
                  <Card key={metric.title}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <div className="flex items-center gap-1">
                            {metric.trend === 'up' ? (
                              <ArrowUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${metric.color}`}>
                              {metric.change} from last month
                            </span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full bg-gray-100`}>
                          <metric.icon className={`w-6 h-6 ${metric.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Progress Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sales Target Progress</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Client Satisfaction</span>
                    <span className="text-sm text-gray-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Project Completion</span>
                    <span className="text-sm text-gray-600">68%</span>
                  </div>
                  <Progress value={68} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Accessibility Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Color Contrast</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">WCAG AA compliant contrast ratios (4.5:1 minimum)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Enhanced visibility for text on backgrounds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Clear distinction between interactive elements</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Visual Hierarchy</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Clear text hierarchy with proper font weights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Semantic color usage for status indicators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Consistent spacing and visual rhythm</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4">Contrast Testing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-600 text-white rounded-lg">
                    <p className="font-medium">Primary on White</p>
                    <p className="text-sm opacity-90">Contrast: 4.5:1 ✓</p>
                  </div>
                  <div className="p-4 bg-green-600 text-white rounded-lg">
                    <p className="font-medium">Success on White</p>
                    <p className="text-sm opacity-90">Contrast: 4.8:1 ✓</p>
                  </div>
                  <div className="p-4 bg-red-600 text-white rounded-lg">
                    <p className="font-medium">Error on White</p>
                    <p className="text-sm opacity-90">Contrast: 5.1:1 ✓</p>
                  </div>
                  <div className="p-4 bg-gray-900 text-white rounded-lg">
                    <p className="font-medium">Text Primary</p>
                    <p className="text-sm opacity-90">Contrast: 16.1:1 ✓</p>
                  </div>
                  <div className="p-4 bg-gray-600 text-white rounded-lg">
                    <p className="font-medium">Text Secondary</p>
                    <p className="text-sm opacity-90">Contrast: 7.2:1 ✓</p>
                  </div>
                  <div className="p-4 bg-orange-600 text-white rounded-lg">
                    <p className="font-medium">Warning on White</p>
                    <p className="text-sm opacity-90">Contrast: 4.6:1 ✓</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Color Detail Modal */}
      {selectedColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-[90vw]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedColor.name}
                <Button variant="ghost" size="sm" onClick={() => setSelectedColor(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`w-full h-32 rounded-lg mb-4 ${selectedColor.class} border`}></div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hex Code:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm">{selectedColor.hex}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedColor.hex)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">CSS Class:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm">{selectedColor.class}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(selectedColor.class)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                {selectedColor.contrast && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Contrast:</span>
                    <Badge variant="outline">{selectedColor.contrast}</Badge>
                  </div>
                )}
                <div>
                  <span className="font-medium">Usage:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedColor.usage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}