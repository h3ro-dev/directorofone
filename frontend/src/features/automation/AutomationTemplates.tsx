import React, { useState, useEffect } from 'react';

interface AutomationTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  averageTimeSaved: number;
  setupTime: number;
  requiredTools: Array<{
    name: string;
    type: string;
    cost: string;
    link?: string;
  }>;
  steps: Array<{
    order: number;
    name: string;
    description: string;
    automated: boolean;
  }>;
}

interface ROI {
  setupCost: number;
  weeklyValue: number;
  monthlyValue: number;
  paybackWeeks: number;
}

export const AutomationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<AutomationTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);
  const [templateROI, setTemplateROI] = useState<ROI | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📚' },
    { id: 'communication', name: 'Email & Communication', icon: '📧' },
    { id: 'scheduling', name: 'Scheduling', icon: '📅' },
    { id: 'reporting', name: 'Reporting', icon: '📊' },
    { id: 'budgeting', name: 'Budget & Finance', icon: '💰' },
    { id: 'administrative', name: 'Admin Tasks', icon: '📋' }
  ];

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    try {
      const url = selectedCategory === 'all' 
        ? '/api/automation/templates'
        : `/api/automation/templates?category=${selectedCategory}`;
      
      const response = await fetch(url);
      const { templates } = await response.json();
      setTemplates(templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const selectTemplate = async (template: AutomationTemplate) => {
    setSelectedTemplate(template);
    
    try {
      const response = await fetch(`/api/automation/templates/${template.id}`);
      const { roi } = await response.json();
      setTemplateROI(roi);
    } catch (error) {
      console.error('Failed to load template ROI:', error);
    }
  };

  const getCostColor = (cost: string) => {
    const colors = {
      'free': 'text-green-600 bg-green-100',
      'low': 'text-blue-600 bg-blue-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-red-600 bg-red-100'
    };
    return colors[cost as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="automation-templates">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Automation Templates
        </h2>
        <p className="text-lg text-gray-600">
          Pre-built automation workflows designed specifically for one-person departments.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {!selectedTemplate && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => selectTemplate(template)}
            >
              <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
              <p className="text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Time Saved</span>
                  <span className="font-semibold text-green-600">
                    {template.averageTimeSaved} hrs/week
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Setup Time</span>
                  <span className="font-medium">{template.setupTime} hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tools Needed</span>
                  <span className="font-medium">{template.requiredTools.length}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {template.requiredTools.slice(0, 2).map((tool, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${getCostColor(tool.cost)}`}
                  >
                    {tool.name}
                  </span>
                ))}
                {template.requiredTools.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{template.requiredTools.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Detail */}
      {selectedTemplate && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => {
              setSelectedTemplate(null);
              setTemplateROI(null);
            }}
            className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to templates
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">{selectedTemplate.name}</h3>
              <p className="text-lg text-gray-600 mb-6">{selectedTemplate.description}</p>

              {/* Implementation Steps */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-4">Implementation Steps</h4>
                <div className="space-y-4">
                  {selectedTemplate.steps.map((step) => (
                    <div key={step.order} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{step.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        {step.automated && (
                          <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Automated
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Tools */}
              <div>
                <h4 className="text-xl font-semibold mb-4">Required Tools</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.requiredTools.map((tool, index) => (
                    <div key={index} className="border border-gray-200 rounded p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium">{tool.name}</h5>
                          <p className="text-sm text-gray-600 capitalize">{tool.type}</p>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${getCostColor(tool.cost)}`}>
                          {tool.cost}
                        </span>
                      </div>
                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                          Learn more →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROI Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-blue-50 rounded-lg p-6 sticky top-6">
                <h4 className="text-xl font-semibold mb-4">ROI Analysis</h4>
                
                {templateROI && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Setup Investment</p>
                      <p className="text-2xl font-bold">${templateROI.setupCost}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weekly Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${templateROI.weeklyValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Value</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${templateROI.monthlyValue}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payback Period</p>
                      <p className="text-2xl font-bold">
                        {templateROI.paybackWeeks.toFixed(1)} weeks
                      </p>
                    </div>
                  </div>
                )}

                <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Get Implementation Help
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};