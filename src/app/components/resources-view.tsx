export function ResourcesView() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-foreground mb-2">Resources</h1>
          <p className="text-muted-foreground">Guides, tutorials, and helpful content</p>
        </div>
        <div className="flex items-center justify-center h-96 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Resources coming soon...</p>
        </div>
      </div>
    </div>
  );
}
