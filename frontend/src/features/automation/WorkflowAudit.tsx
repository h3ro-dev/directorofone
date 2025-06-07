import React, { useState } from 'react';

interface AuditResults {
  totalTasksAnalyzed: number;
  timeWasted: {
    hoursPerWeek: number;
    mainCulprits: Array<{
      name: string;
      hoursPerWeek: number;
      automationPotential: 'high' | 'medium' | 'low';
    }>;
  };
  automationOpportunities: Array<{
    id: string;
    taskCategory: string;
    proposedAutomation: string;
    timeSavings: number;
    roi: {
      weeklyTimeSaved: number;
      monthlyValueGenerated: number;
      paybackPeriodWeeks: number;
    };
  }>;
  estimatedTimeSavings: {
    hoursPerWeek: number;
    percentageImprovement: number;
  };
}

export const WorkflowAudit: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AuditResults | null>(null);

  const startAudit = async () => {
    setIsAnalyzing(true);
    
    try {
      // Start the audit
      const startResponse = await fetch('/api/automation/audit/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user' })
      });
      
      const { audit } = await startResponse.json();
      
      // Poll for results
      setTimeout(async () => {
        const resultsResponse = await fetch(`/api/automation/audit/${audit.id}/results`);
        const { results } = await resultsResponse.json();
        setResults(results);
        setIsAnalyzing(false);
      }, 3000);
    } catch (error) {
      console.error('Audit failed:', error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="workflow-audit bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Free Workflow Audit
        </h2>
        <p className="text-lg text-gray-600">
          Discover how much time you're wasting on repetitive tasks and get personalized automation recommendations.
        </p>
      </div>

      {!results && !isAnalyzing && (
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-4">
            Ready to optimize your workflow?
          </h3>
          <button
            onClick={startAudit}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Free Audit
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">
            Analyzing your workflow patterns...
          </p>
        </div>
      )}

      {results && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Time Wasted Weekly
              </h4>
              <p className="text-3xl font-bold text-red-900">
                {results.timeWasted.hoursPerWeek} hours
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Potential Time Saved
              </h4>
              <p className="text-3xl font-bold text-green-900">
                {results.estimatedTimeSavings.hoursPerWeek} hours
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Efficiency Gain
              </h4>
              <p className="text-3xl font-bold text-blue-900">
                {results.estimatedTimeSavings.percentageImprovement.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Main Time Wasters */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Your Biggest Time Wasters
            </h3>
            <div className="space-y-3">
              {results.timeWasted.mainCulprits.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{task.name}</h4>
                    <p className="text-sm text-gray-600">
                      {task.hoursPerWeek} hours/week
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.automationPotential === 'high' 
                      ? 'bg-green-100 text-green-800'
                      : task.automationPotential === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.automationPotential} automation potential
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Opportunities */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Recommended Automations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.automationOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-2">
                    {opportunity.taskCategory}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {opportunity.proposedAutomation}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Saved:</span>
                      <span className="font-medium">{opportunity.timeSavings} hrs/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Value:</span>
                      <span className="font-medium text-green-600">
                        ${opportunity.roi.monthlyValueGenerated}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI Period:</span>
                      <span className="font-medium">
                        {opportunity.roi.paybackPeriodWeeks.toFixed(1)} weeks
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to save {results.estimatedTimeSavings.hoursPerWeek} hours every week?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Get a personalized automation roadmap and implementation support.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Schedule Free Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};