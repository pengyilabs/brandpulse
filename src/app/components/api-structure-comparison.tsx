import { useState } from 'react';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FieldChange {
  field: string;
  status: 'unchanged' | 'renamed' | 'added' | 'removed';
  note?: string;
  oldPath?: string;
  newPath?: string;
}

interface ComparisonItem {
  title: string;
  description: string;
  currentJson: any;
  recommendedJson: any;
  fieldChanges: FieldChange[];
}

// ─── Comparison Data ──────────────────────────────────────────────────────────

const COMPARISONS: ComparisonItem[] = [
  {
    title: 'POST /api/v1/projects - Request Body',
    description: 'Creating a new project',
    currentJson: {
      profile_name: 'New Project',
      project_url: 'example.com',
      project_context: 'Project description',
      target_audience: 'Target audience description'
    },
    recommendedJson: {
      name: 'New Project',
      client: 'New Project',
      description: 'Project description',
      targetAudience: 'Target audience description',
      website: 'example.com',
      status: 'active',
      accentColor: '#3B82F6'
    },
    fieldChanges: [
      { field: 'name', status: 'renamed', note: 'profile_name → name', oldPath: 'profile_name', newPath: 'name' },
      { field: 'client', status: 'added', note: 'New required field', newPath: 'client' },
      { field: 'description', status: 'renamed', note: 'project_context → description', oldPath: 'project_context', newPath: 'description' },
      { field: 'targetAudience', status: 'renamed', note: 'target_audience → targetAudience', oldPath: 'target_audience', newPath: 'targetAudience' },
      { field: 'website', status: 'renamed', note: 'project_url → website', oldPath: 'project_url', newPath: 'website' },
      { field: 'status', status: 'added', note: 'New field with default value', newPath: 'status' },
      { field: 'accentColor', status: 'added', note: 'New field for brand color', newPath: 'accentColor' }
    ]
  },
  {
    title: 'POST /api/v1/projects - Response Body',
    description: 'Response after creating a project',
    currentJson: {
      project: {
        id: 137,
        profile_name: 'New Project',
        project_context: 'Project description',
        project_url: 'example.com',
        target_audience: 'Target audience description',
        articles_count: 0,
        created_at: '2026-08-06T12:00:00Z'
      }
    },
    recommendedJson: {
      project: {
        id: 8,
        name: 'New Project',
        client: 'New Project',
        campaigns: 0,
        contentItems: 0,
        status: 'active',
        lastUpdated: 'just now',
        accentColor: '#3B82F6'
      }
    },
    fieldChanges: [
      { field: 'id', status: 'unchanged' },
      { field: 'name', status: 'renamed', note: 'profile_name → name' },
      { field: 'client', status: 'added', note: 'New field' },
      { field: 'campaigns', status: 'added', note: 'Computed field' },
      { field: 'contentItems', status: 'renamed', note: 'articles_count → contentItems' },
      { field: 'status', status: 'added', note: 'New field' },
      { field: 'lastUpdated', status: 'renamed', note: 'created_at → lastUpdated (formatted)' },
      { field: 'accentColor', status: 'added', note: 'New field' }
    ]
  },
  {
    title: 'GET /api/v1/projects - Response Body',
    description: 'Listing all projects',
    currentJson: {
      projects: [
        {
          id: 136,
          profile_name: 'Lumina Wellness',
          project_context: 'yoga institute with over 40 years of teachings',
          project_url: 'lumina-wellness.example',
          target_audience: 'yoga teachers, new students',
          writing_tone: 'concise and objective',
          writing_level: 'high school audience',
          articles_count: 24,
          created_at: '2026-01-15T10:30:00Z'
        }
      ],
      meta: { total_count: 3, page: 1, per_page: 20 }
    },
    recommendedJson: {
      projects: [
        {
          id: 1,
          name: 'Lumina Wellness Content',
          client: 'Lumina Wellness',
          campaigns: 1,
          contentItems: 24,
          status: 'active',
          lastUpdated: '2 hours ago',
          accentColor: '#D946EF'
        }
      ],
      meta: { total_count: 3, page: 1, per_page: 20 }
    },
    fieldChanges: [
      { field: 'id', status: 'unchanged' },
      { field: 'name', status: 'renamed', note: 'profile_name → name' },
      { field: 'client', status: 'added', note: 'New field' },
      { field: 'campaigns', status: 'added', note: 'Computed count' },
      { field: 'contentItems', status: 'renamed', note: 'articles_count → contentItems' },
      { field: 'status', status: 'added', note: 'New field' },
      { field: 'lastUpdated', status: 'renamed', note: 'updated_at → lastUpdated (relative time)' },
      { field: 'accentColor', status: 'added', note: 'New field' },
      { field: 'writing_tone', status: 'removed', note: 'Not needed in UI' },
      { field: 'writing_level', status: 'removed', note: 'Not needed in UI' }
    ]
  },
  {
    title: 'PATCH /api/v1/projects/:id - Request Body',
    description: 'Updating an existing project',
    currentJson: {
      profile_name: 'Updated Project Name',
      project_context: 'Updated context'
    },
    recommendedJson: {
      name: 'Updated Project Name',
      description: 'Updated context',
      client: 'Lumina Wellness',
      status: 'active',
      accentColor: '#D946EF'
    },
    fieldChanges: [
      { field: 'name', status: 'renamed', note: 'profile_name → name' },
      { field: 'description', status: 'renamed', note: 'project_context → description' },
      { field: 'client', status: 'added', note: 'New field' },
      { field: 'status', status: 'added', note: 'New field' },
      { field: 'accentColor', status: 'added', note: 'New field' }
    ]
  },
  {
    title: 'POST /api/v1/resources/:id/extract_clips - Request Body',
    description: 'Extracting clips from a video resource',
    currentJson: {
      clip_count: 5,
      clip_duration: 60
    },
    recommendedJson: {
      clipCount: 5,
      clipDuration: 60,
      contentType: 'short-clips',
      funnelStage: 'top'
    },
    fieldChanges: [
      { field: 'clipCount', status: 'renamed', note: 'clip_count → clipCount' },
      { field: 'clipDuration', status: 'renamed', note: 'clip_duration → clipDuration' },
      { field: 'contentType', status: 'added', note: 'New field for content classification' },
      { field: 'funnelStage', status: 'added', note: 'New field for funnel tracking' }
    ]
  }
];

// ─── Helper Components ────────────────────────────────────────────────────────

function JsonField({ 
  name, 
  value, 
  indent = 0, 
  status,
  note,
  isLast = false 
}: { 
  name: string; 
  value: any; 
  indent?: number;
  status?: FieldChange['status'];
  note?: string;
  isLast?: boolean;
}) {
  const indentStr = '  '.repeat(indent);
  
  const getStatusColor = () => {
    switch (status) {
      case 'added': return 'text-[#8FE6B5] bg-[#12B667]/10';
      case 'renamed': return 'text-amber-400 bg-amber-500/10';
      case 'removed': return 'text-red-400 bg-red-500/10 line-through';
      case 'unchanged': return 'text-foreground';
      default: return 'text-foreground';
    }
  };
  
  const getStatusIndicator = () => {
    switch (status) {
      case 'added': return '+ ';
      case 'removed': return '- ';
      case 'renamed': return '~ ';
      default: return '  ';
    }
  };
  
  const renderValue = (val: any, indentLevel: number): React.ReactNode => {
    if (val === null) return <span className="text-purple-400">null</span>;
    if (typeof val === 'string') return <span className="text-green-400">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-blue-400">{val}</span>;
    if (typeof val === 'boolean') return <span className="text-blue-400">{val.toString()}</span>;
    
    if (Array.isArray(val)) {
      if (val.length === 0) return <span>[]</span>;
      return (
        <span>
          {'[\n'}
          {val.map((item, idx) => (
            <span key={idx}>
              {indentStr}  {'  '.repeat(indentLevel)}
              {renderValue(item, indentLevel + 1)}
              {idx < val.length - 1 ? ',' : ''}
              {'\n'}
            </span>
          ))}
          {indentStr}{']'}
        </span>
      );
    }
    
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return <span>{'{}'}</span>;
      return (
        <span>
          {'{\n'}
          {keys.map((key, idx) => (
            <JsonField
              key={key}
              name={key}
              value={val[key]}
              indent={indentLevel + 1}
              isLast={idx === keys.length - 1}
            />
          ))}
          {indentStr}{'}'}
        </span>
      );
    }
    
    return <span>{String(val)}</span>;
  };
  
  return (
    <div className={cn('flex items-start', getStatusColor())}>
      <span className="select-none opacity-50 mr-1">{getStatusIndicator()}</span>
      <span className="flex-1">
        {indentStr}
        <span className="text-foreground">"{name}"</span>
        <span className="text-foreground">: </span>
        {renderValue(value, indent)}
        {!isLast && <span>,</span>}
        {note && (
          <span className="ml-2 text-xs text-muted-foreground">
            {' // '}{note}
          </span>
        )}
      </span>
    </div>
  );
}

function JsonViewer({ 
  data, 
  fieldChanges,
  label 
}: { 
  data: any;
  fieldChanges: FieldChange[];
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getFieldStatus = (fieldName: string): FieldChange['status'] | undefined => {
    const change = fieldChanges.find(c => c.field === fieldName);
    return change?.status;
  };
  
  const getFieldNote = (fieldName: string): string | undefined => {
    const change = fieldChanges.find(c => c.field === fieldName);
    return change?.note;
  };
  
  const renderJsonWithAnnotations = (obj: any, indent: number = 0): React.ReactNode => {
    if (typeof obj !== 'object' || obj === null) {
      return null;
    }
    
    const keys = Object.keys(obj);
    if (keys.length === 0) return <span>{'{}'}</span>;
    
    return (
      <span>
        {'{\n'}
        {keys.map((key, idx) => {
          const status = getFieldStatus(key);
          const note = getFieldNote(key);
          const value = obj[key];
          const indentStr = '  '.repeat(indent + 1);
          
          return (
            <div key={key} className={cn(
              'flex items-start px-1 rounded',
              status === 'added' && 'bg-[#12B667]/10',
              status === 'renamed' && 'bg-amber-500/10',
              status === 'removed' && 'bg-red-500/10'
            )}>
              <span className={cn(
                'select-none opacity-50 mr-1',
                status === 'added' && 'text-[#8FE6B5]',
                status === 'renamed' && 'text-amber-400',
                status === 'removed' && 'text-red-400'
              )}>
                {status === 'added' ? '+ ' : status === 'removed' ? '- ' : status === 'renamed' ? '~ ' : '  '}
              </span>
              <span className="flex-1">
                {indentStr}
                <span className="text-foreground">"{key}"</span>
                <span className="text-foreground">: </span>
                {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                  <span>
                    {'{\n'}
                    {Object.keys(value).map((subKey, subIdx) => {
                      const subStatus = getFieldStatus(subKey);
                      const subNote = getFieldNote(subKey);
                      const subValue = value[subKey];
                      const subIndentStr = '  '.repeat(indent + 2);
                      
                      return (
                        <div key={subKey} className={cn(
                          'flex items-start px-1 rounded',
                          subStatus === 'added' && 'bg-[#12B667]/10',
                          subStatus === 'renamed' && 'bg-amber-500/10',
                          subStatus === 'removed' && 'bg-red-500/10'
                        )}>
                          <span className={cn(
                            'select-none opacity-50 mr-1',
                            subStatus === 'added' && 'text-[#8FE6B5]',
                            subStatus === 'renamed' && 'text-amber-400',
                            subStatus === 'removed' && 'text-red-400'
                          )}>
                            {subStatus === 'added' ? '+ ' : subStatus === 'removed' ? '- ' : subStatus === 'renamed' ? '~ ' : '  '}
                          </span>
                          <span className="flex-1">
                            {subIndentStr}
                            <span className="text-foreground">"{subKey}"</span>
                            <span className="text-foreground">: </span>
                            {typeof subValue === 'string' ? (
                              <span className="text-green-400">"{subValue}"</span>
                            ) : typeof subValue === 'number' ? (
                              <span className="text-blue-400">{subValue}</span>
                            ) : (
                              <span>{JSON.stringify(subValue)}</span>
                            )}
                            {subIdx < Object.keys(value).length - 1 && <span>,</span>}
                            {subNote && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                {' // '}{subNote}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                    {'  '.repeat(indent + 1)}{'}'}
                  </span>
                ) : Array.isArray(value) ? (
                  <span>
                    {'[\n'}
                    {value.map((item, itemIdx) => (
                      <span key={itemIdx}>
                        {'  '.repeat(indent + 2)}
                        {typeof item === 'object' && item !== null ? (
                          <span>
                            {'{\n'}
                            {Object.keys(item).map((subKey, subIdx) => {
                              const subStatus = getFieldStatus(subKey);
                              const subNote = getFieldNote(subKey);
                              const subValue = item[subKey];
                              const subIndentStr = '  '.repeat(indent + 3);
                              
                              return (
                                <div key={subKey} className={cn(
                                  'flex items-start px-1 rounded',
                                  subStatus === 'added' && 'bg-[#12B667]/10',
                                  subStatus === 'renamed' && 'bg-amber-500/10',
                                  subStatus === 'removed' && 'bg-red-500/10'
                                )}>
                                  <span className={cn(
                                    'select-none opacity-50 mr-1',
                                    subStatus === 'added' && 'text-[#8FE6B5]',
                                    subStatus === 'renamed' && 'text-amber-400',
                                    subStatus === 'removed' && 'text-red-400'
                                  )}>
                                    {subStatus === 'added' ? '+ ' : subStatus === 'removed' ? '- ' : subStatus === 'renamed' ? '~ ' : '  '}
                                  </span>
                                  <span className="flex-1">
                                    {subIndentStr}
                                    <span className="text-foreground">"{subKey}"</span>
                                    <span className="text-foreground">: </span>
                                    {typeof subValue === 'string' ? (
                                      <span className="text-green-400">"{subValue}"</span>
                                    ) : typeof subValue === 'number' ? (
                                      <span className="text-blue-400">{subValue}</span>
                                    ) : (
                                      <span>{JSON.stringify(subValue)}</span>
                                    )}
                                    {subIdx < Object.keys(item).length - 1 && <span>,</span>}
                                    {subNote && (
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        {' // '}{subNote}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                            {'  '.repeat(indent + 2)}{'}'}
                          </span>
                        ) : (
                          <span className="text-green-400">"{item}"</span>
                        )}
                        {itemIdx < value.length - 1 && <span>,</span>}
                        {'\n'}
                      </span>
                    ))}
                    {'  '.repeat(indent + 1)}{']'}
                  </span>
                ) : typeof value === 'string' ? (
                  <span className="text-green-400">"{value}"</span>
                ) : typeof value === 'number' ? (
                  <span className="text-blue-400">{value}</span>
                ) : (
                  <span>{JSON.stringify(value)}</span>
                )}
                {idx < keys.length - 1 && <span>,</span>}
                {note && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {' // '}{note}
                  </span>
                )}
              </span>
            </div>
          );
        })}
        {'  '.repeat(indent)}{'}'}
      </span>
    );
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="w-3 h-3 text-[#8FE6B5]" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-xs font-mono bg-background/50 border border-border rounded-lg p-3 overflow-x-auto max-h-96 overflow-y-auto">
        {renderJsonWithAnnotations(data)}
      </pre>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApiStructureComparison() {
  const [selectedComparison, setSelectedComparison] = useState(0);
  
  const comparison = COMPARISONS[selectedComparison];
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">API Structure Comparison</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Before and after view of data structure transformations
          </p>
        </div>
        
        {/* Legend */}
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Visual Indicators</h3>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#12B667]/20 border border-[#12B667]/40"></div>
              <span className="text-[#8FE6B5] font-medium">+ Added</span>
              <span className="text-muted-foreground">New field</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40"></div>
              <span className="text-amber-400 font-medium">~ Renamed</span>
              <span className="text-muted-foreground">Field renamed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40"></div>
              <span className="text-red-400 font-medium">- Removed</span>
              <span className="text-muted-foreground">Field removed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-foreground/10 border border-foreground/20"></div>
              <span className="text-foreground font-medium">Unchanged</span>
              <span className="text-muted-foreground">No changes</span>
            </div>
          </div>
        </div>
        
        {/* Comparison Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {COMPARISONS.map((comp, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedComparison(idx)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedComparison === idx
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-card/80'
              )}
            >
              {comp.title.split(' - ')[0]}
            </button>
          ))}
        </div>
        
        {/* Comparison View */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Comparison Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">{comparison.title}</h2>
            <p className="text-sm text-muted-foreground">{comparison.description}</p>
          </div>
          
          {/* Two Column Comparison */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Current Implementation */}
              <div>
                <JsonViewer
                  data={comparison.currentJson}
                  fieldChanges={comparison.fieldChanges}
                  label="Current Implementation"
                />
              </div>
              
              {/* Recommended Implementation */}
              <div>
                <JsonViewer
                  data={comparison.recommendedJson}
                  fieldChanges={comparison.fieldChanges}
                  label="Recommended Implementation"
                />
              </div>
            </div>
          </div>
          
          {/* Field Changes Summary */}
          <div className="p-6 border-t border-border bg-background/30">
            <h3 className="text-sm font-semibold text-foreground mb-3">Field Changes Summary</h3>
            <div className="space-y-2">
              {comparison.fieldChanges.map((change, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className={cn(
                    'px-2 py-0.5 rounded font-mono font-bold',
                    change.status === 'added' && 'bg-[#12B667]/10 text-[#8FE6B5] border border-[#12B667]/20',
                    change.status === 'renamed' && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
                    change.status === 'removed' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                    change.status === 'unchanged' && 'bg-foreground/10 text-foreground border border-foreground/20'
                  )}>
                    {change.status === 'added' ? '+' : change.status === 'renamed' ? '~' : change.status === 'removed' ? '-' : '='}
                  </span>
                  <code className="text-foreground font-mono">{change.field}</code>
                  {change.note && (
                    <>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{change.note}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
