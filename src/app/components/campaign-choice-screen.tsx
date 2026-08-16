import { Copy, Plus } from 'lucide-react';

interface CampaignChoiceScreenProps {
  onStartFresh: () => void;
  onDuplicate: (campaignId: number) => void;
  existingCampaigns: Array<{ id: number; name: string; }>;
}

export function CampaignChoiceScreen({ onStartFresh, onDuplicate, existingCampaigns }: CampaignChoiceScreenProps) {
  const handleDuplicateClick = () => {
    const select = document.getElementById('campaign-select') as HTMLSelectElement;
    if (select && select.value) {
      onDuplicate(parseInt(select.value));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-foreground mb-2">Create New Campaign</h1>
          <p className="text-muted-foreground">Choose how you'd like to start</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={onStartFresh}
            className="bg-card border-2 border-border rounded-xl p-8 hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Start Fresh</h3>
              <p className="text-sm text-muted-foreground">
                Create a new campaign from scratch with default settings
              </p>
            </div>
          </button>

          <div className="bg-card border-2 border-border rounded-xl p-8 flex flex-col">
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Copy className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Duplicate from Existing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start with settings from a previous campaign
              </p>

              <div className="w-full mt-auto space-y-3">
                <select
                  id="campaign-select"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground"
                  defaultValue=""
                >
                  <option value="" disabled>Select a campaign</option>
                  {existingCampaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleDuplicateClick}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Duplicate Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
