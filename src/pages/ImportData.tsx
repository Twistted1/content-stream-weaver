import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileSpreadsheet, FileText, Database, CheckCircle, XCircle, Clock, ArrowRight, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockImportHistory = [
  { id: 1, fileName: "posts_march_2024.csv", type: "Posts", records: 156, status: "completed", date: "2024-03-15" },
  { id: 2, fileName: "analytics_q1.xlsx", type: "Analytics", records: 2340, status: "completed", date: "2024-03-10" },
  { id: 3, fileName: "campaigns.csv", type: "Campaigns", records: 45, status: "failed", date: "2024-03-08" },
  { id: 4, fileName: "audience_data.csv", type: "Audience", records: 890, status: "processing", date: "2024-03-05" },
];

const fieldMappings = [
  { source: "post_title", target: "Title", matched: true },
  { source: "content_body", target: "Content", matched: true },
  { source: "pub_date", target: "Publish Date", matched: true },
  { source: "platform_name", target: "Platform", matched: true },
  { source: "engagement_rate", target: "Engagement", matched: false },
  { source: "author_id", target: "Author", matched: false },
];

const ImportData = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importStep, setImportStep] = useState<"upload" | "mapping" | "preview">("upload");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setImportStep("mapping");
    toast({
      title: "File uploaded",
      description: `${file.name} is ready for mapping.`,
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      failed: "destructive",
      processing: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground mt-1">
            Upload and import content from CSV, Excel, or other data sources
          </p>
        </div>

        <Tabs defaultValue="import" className="space-y-6">
          <TabsList>
            <TabsTrigger value="import">New Import</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 py-4">
              {["upload", "mapping", "preview"].map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      importStep === step
                        ? "bg-primary text-primary-foreground"
                        : index < ["upload", "mapping", "preview"].indexOf(importStep)
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium capitalize">{step}</span>
                  {index < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
                </div>
              ))}
            </div>

            {importStep === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload File</CardTitle>
                  <CardDescription>
                    Drag and drop your file or click to browse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drop your file here</h3>
                    <p className="text-muted-foreground mb-4">
                      Supports CSV, XLSX, XLS, and JSON files up to 10MB
                    </p>
                    <label>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      <Button variant="outline" asChild>
                        <span>Browse Files</span>
                      </Button>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <FileSpreadsheet className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">CSV Files</p>
                        <p className="text-sm text-muted-foreground">Comma-separated values</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">Excel Files</p>
                        <p className="text-sm text-muted-foreground">XLSX, XLS formats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <Database className="h-8 w-8 text-purple-600" />
                      <div>
                        <p className="font-medium">JSON Files</p>
                        <p className="text-sm text-muted-foreground">Structured data</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {importStep === "mapping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Map Fields</CardTitle>
                  <CardDescription>
                    Match source columns to destination fields
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {uploadedFile && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                      <span className="font-medium">{uploadedFile.name}</span>
                      <Badge variant="secondary" className="ml-auto">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </Badge>
                    </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Column</TableHead>
                        <TableHead>Maps To</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fieldMappings.map((mapping) => (
                        <TableRow key={mapping.source}>
                          <TableCell className="font-mono text-sm">{mapping.source}</TableCell>
                          <TableCell>
                            <Select defaultValue={mapping.matched ? mapping.target : ""}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Title">Title</SelectItem>
                                <SelectItem value="Content">Content</SelectItem>
                                <SelectItem value="Publish Date">Publish Date</SelectItem>
                                <SelectItem value="Platform">Platform</SelectItem>
                                <SelectItem value="Engagement">Engagement</SelectItem>
                                <SelectItem value="Author">Author</SelectItem>
                                <SelectItem value="skip">Skip this field</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {mapping.matched ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Auto-matched
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                Needs review
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setImportStep("upload")}>
                      Back
                    </Button>
                    <Button onClick={() => setImportStep("preview")}>
                      Continue to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {importStep === "preview" && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Import</CardTitle>
                  <CardDescription>
                    Review your data before importing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">152</p>
                      <p className="text-sm text-muted-foreground">Valid Records</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-2xl font-bold text-destructive">4</p>
                      <p className="text-sm text-muted-foreground">Errors</p>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Spring Campaign Launch</TableCell>
                          <TableCell>Instagram</TableCell>
                          <TableCell>2024-03-20</TableCell>
                          <TableCell><Badge>Valid</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Product Announcement</TableCell>
                          <TableCell>Twitter</TableCell>
                          <TableCell>2024-03-21</TableCell>
                          <TableCell><Badge>Valid</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Weekly Newsletter</TableCell>
                          <TableCell>LinkedIn</TableCell>
                          <TableCell>2024-03-22</TableCell>
                          <TableCell><Badge>Valid</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setImportStep("mapping")}>
                      Back to Mapping
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Import started",
                          description: "Your data is being imported. This may take a few moments.",
                        });
                        setImportStep("upload");
                        setUploadedFile(null);
                      }}
                    >
                      Start Import
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Import History</CardTitle>
                <CardDescription>View past imports and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockImportHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            {item.fileName}
                          </div>
                        </TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.records.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Posts Import", description: "Import social media posts with engagement data", icon: FileText },
                { name: "Analytics Data", description: "Bulk import analytics and metrics", icon: Database },
                { name: "Campaign Schedule", description: "Import campaign timelines and schedules", icon: FileSpreadsheet },
              ].map((template) => (
                <Card key={template.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <template.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <Button variant="link" className="px-0 mt-2" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ImportData;
