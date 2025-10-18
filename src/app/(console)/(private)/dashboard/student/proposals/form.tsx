'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { proposalSchema } from '@/lib/validation/proposal';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Extended schema with UI-specific fields
const projectSchema = proposalSchema.extend({
  file: z.any().optional(),
  category: z.string().min(1, 'Project category is required'),
  locationMode: z.literal('Offline'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  city: z.string().min(1, 'City is required'),
  placeVisited: z.string().min(1, 'Place visited is required'),
  travelTime: z.string().min(1, 'Travel time is required'),
  executionTime: z.string().min(1, 'Execution time is required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  gdriveLink: z.string().url('Please enter a valid Google Drive URL').min(1, 'Google Drive link is required'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

// Status message type for better UI feedback
type StatusMessage = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const indianStatesWithDistricts: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool",
    "Prakasam", "Sri Potti Sriramulu Nellore", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa", "Alluri Sitharama Raju",
    "Anakapalli", "Bapatla", "Eluru", "Kakinada", "Konaseema", "Nandyal",
    "Palnadu", "Parvathipuram Manyam", "Tirupati"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Pakke-Kessang", "Papum Pare",
    "Kamle", "Kra Daadi", "Kurung Kumey", "Lower Subansiri", "Upper Subansiri",
    "Shi Yomi", "West Siang", "East Siang", "Siang", "Lower Siang", "Upper Siang",
    "Upper Siang", "Upper Siang", "Upper Siang", "Upper Siang", "Upper Siang",
    "Upper Siang", "Upper Siang", "Upper Siang", "Upper Siang"
  ],
  "Assam": [
    "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo",
    "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara",
    "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan",
    "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon",
     "Sivasagar", "Sonitpur", "South Salmara-Mankachar",
    "Tinsukia", "Udalguri", "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur",
    "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui",
    "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai",
    "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
    "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura",
    "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur",
    "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa",
    "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund",
    "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma",
    "Surajpur", "Surguja"
  ],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar",
    "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar",
    "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot",
    "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram",
    "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh",
    "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
    "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti",
    "Mandi", "Shimla", "Sirmaur", "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
    "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti",
    "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
    "Sahebganj", "Saraikela Kharsawan", "Simdega", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belagavi", "Ballari",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga",
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri",
    "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur",
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
    "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
    "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani",
    "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh",
    "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad",
    "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla",
    "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh",
    "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur",
    "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
    "Washim", "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl",
    "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
    "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai",
    "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip"
  ],
  "Nagaland": [
    "Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung",
    "Mon", "Niuland", "Noklak", "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack",
    "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
    "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur",
    "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka",
    "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana",
    "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar",
    "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara",
    "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur",
    "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
    "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand",
    "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
  ],
  "Sikkim": ["East Sikkim", "West Sikkim", "North Sikkim", "South Sikkim", "Pakyong", "Soreng"],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
    "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri",
    "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
    "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
    "Vellore", "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial",
    "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet",
    "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy",
    "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura",
    "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya",
    "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki",
    "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli",
    "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad",
    "Gautam Buddh Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
    "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow",
    "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur",
    "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli",
    "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
    "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao",
    "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar",
    "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal",
    "Udham Singh Nagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong",
    "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman",
    "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia",
    "South 24 Parganas", "Uttar Dinajpur"
  ],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu",
    "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri",
    "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": [
    "Agatti", "Amini", "Andrott", "Bitra", "Chetlat", "Kadmat", "Kalpeni",
    "Kavaratti", "Kiltan", "Minicoy"
  ],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};


interface ExistingProposal {
  id: number;
  title: string;
  description: string;
  content: string;
  attachment?: string;
  link?: string;  // Will contain JSON string of metadata for auto-fill
  // Add metadata fields if they exist (legacy support)
  metadata?: {
    category?: string;
    locationMode?: string;
    state?: string;
    district?: string;
    city?: string;
    placeVisited?: string;
    travelTime?: string;
    executionTime?: string;
    completionDate?: string;
  };
}

interface ProjectFormProps {
  existingProposal?: ExistingProposal;
  onEditMode?: (isEdit: boolean) => void;
}

export default function ProjectForm({ existingProposal, onEditMode }: ProjectFormProps) {
  const [selectedState, setSelectedState] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loadedProposal, setLoadedProposal] = useState<ExistingProposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamData, setTeamData] = useState<any>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const states = Object.keys(indianStatesWithDistricts);
  const districts = selectedState ? indianStatesWithDistricts[selectedState] || [] : [];

  // Load team data to get project pillar for auto-filling category
  useEffect(() => {
    async function loadTeamData() {
      try {
        const response = await fetch('/api/student/team');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.team) {
            console.log('Team data loaded:', data.team);
            setTeamData(data.team);
            
            // Auto-fill category and title with team data (always override)
            if (data.team.projectPillar) {
              console.log('Auto-filling category with project pillar:', data.team.projectPillar);
              setValue('category', data.team.projectPillar);
            }
            if (data.team.projectTitle) {
              console.log('Auto-filling title with project title:', data.team.projectTitle);
              setValue('title', data.team.projectTitle);
            }
          }
        }
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    }

    loadTeamData();
  }, [existingProposal, loadedProposal, setValue]);

  // Load existing proposal data if user has a rejected proposal
  useEffect(() => {
    async function loadExistingProposal() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/student/proposals');
        
        if (response.ok) {
          const data = await response.json();
          console.log('API response for loading proposals:', data);
          
          if (data.success && data.data && data.data.length > 0) {
            const proposal = data.data[0]; // Get the latest proposal
            console.log('Latest proposal found:', proposal);
            
            // Only auto-load if it's REJECTED (allowing editing)
            if (proposal.state === 'REJECTED') {
              console.log('Loading rejected proposal for editing:', proposal.id);
              setLoadedProposal(proposal);
            } else {
              console.log('Proposal state is not REJECTED, state:', proposal.state);
            }
          } else {
            console.log('No proposals found in response');
          }
        } else {
          console.log('API response not OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error loading existing proposal:', error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only load if no existing proposal is passed as prop
    if (!existingProposal) {
      loadExistingProposal();
    } else {
      setIsLoading(false);
    }
  }, [existingProposal]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
      // Clear file error when files are selected
      setFileError(null);
    }
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload files to server
  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          uploadedUrls.push(uploadResult.url);
        } else {
          console.error('Failed to upload file:', file.name);
        }
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
      }
    }
    
    return uploadedUrls;
  };

  // Pre-fill form with existing proposal data if editing
  useEffect(() => {
    const proposal = existingProposal || loadedProposal;
    
    if (proposal) {
      console.log('Pre-filling form with proposal:', proposal);
      
      // Notify parent that we're in edit mode
      onEditMode?.(true);
      
      // Set basic fields - title should always come from team data, not proposal
      // setValue('title', proposal.title); // Comment out - title now auto-filled from team
      setValue('description', proposal.description);
      
      // Extract content and metadata
      let cleanContent = proposal.content;
      let metadata = null;
      
      // Try to extract metadata from content field (new format)
      const metadataMatch = proposal.content.match(/<!-- METADATA:(.*?) -->/);
      if (metadataMatch) {
        try {
          metadata = JSON.parse(metadataMatch[1]);
          // Remove the metadata comment from content
          cleanContent = proposal.content.replace(/\n\n<!-- METADATA:.*? -->/, '');
          console.log('Extracted metadata from content field:', metadata);
        } catch (e) {
          console.log('Failed to parse metadata from content field');
        }
      }
      
      // Fallback: Try to parse metadata from link field (old format)
      if (!metadata && proposal.link) {
        try {
          metadata = JSON.parse(proposal.link);
          console.log('Parsed metadata from link field (legacy):', metadata);
        } catch (e) {
          console.log('Link field is not JSON metadata, checking metadata property. Link content:', proposal.link);
        }
      }
      
      // Fallback to existing metadata property (legacy format)
      if (!metadata && proposal.metadata) {
        metadata = proposal.metadata;
        console.log('Using metadata property:', metadata);
      }
      
      setValue('content', cleanContent);
      
      // Set Google Drive link from the proposal's link field
      setValue('gdriveLink', proposal.link || '');
      
      // Set metadata fields if they exist
      if (metadata) {
        console.log('Setting form values with metadata:', metadata);
        
        // Only set category if it has a value
        if (metadata.category && metadata.category.trim()) {
          setValue('category', metadata.category);
        }
        
        setValue('locationMode', 'Offline');
        
        if (metadata.state && metadata.state.trim()) {
          setValue('state', metadata.state);
        }
        if (metadata.district && metadata.district.trim()) {
          setValue('district', metadata.district);
        }
        if (metadata.city && metadata.city.trim()) {
          setValue('city', metadata.city);
        }
        if (metadata.placeVisited && metadata.placeVisited.trim()) {
          setValue('placeVisited', metadata.placeVisited);
        }
        if (metadata.travelTime && metadata.travelTime.trim()) {
          setValue('travelTime', metadata.travelTime);
        }
        if (metadata.executionTime && metadata.executionTime.trim()) {
          setValue('executionTime', metadata.executionTime);
        }
        if (metadata.completionDate && metadata.completionDate.trim()) {
          setValue('completionDate', metadata.completionDate);
        }
        
        // Set selected state for district dropdown
        if (metadata.state && metadata.state.trim()) {
          setSelectedState(metadata.state);
        }
      } else {
        console.log('No metadata found for pre-filling. This may be a proposal created before metadata storage was implemented.');
        // For older proposals without metadata, set defaults only for required fields
        setValue('locationMode', 'Offline');
        
        // Show a helpful message to the user
        setStatusMessage({
          type: 'info',
          message: 'Please fill in all form fields below. Your previous basic information (title, description, content) has been loaded, but additional details need to be filled in again.'
        });
      }
      
      // Handle existing file attachments
      if (proposal.attachment) {
        // Parse comma-separated file URLs
        const fileUrls = proposal.attachment.split(',').filter(url => url.trim());
        // You could set these in a display component to show existing files
        console.log('Existing files:', fileUrls);
      }
    } else {
      // Notify parent that we're in create mode
      onEditMode?.(false);
    }
  }, [existingProposal, loadedProposal, setValue, onEditMode]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    
    // Check if files are uploaded (required)
    if (selectedFiles.length === 0 && (!existingProposal?.attachment && !loadedProposal?.attachment)) {
      setFileError('At least one file must be uploaded');
      setIsSubmitting(false);
      return;
    }
    
    // Clear file error if validation passes
    setFileError(null);
    
    try {
      // Check if user is logged in and has a team
      try {
        const authCheck = await fetch('/api/test/auth');
        if (!authCheck.ok) {
          const authError = await authCheck.json();
          console.error('Auth check failed:', authError);
          throw new Error(authError.message || 'Authentication failed. Please try logging in again.');
        }
        
        const authData = await authCheck.json();
        console.log('Auth check succeeded:', authData);
        
        if (!authData.success) {
          throw new Error('Authentication error');
        }
        
        if (!authData.data.hasTeam) {
          throw new Error('You must be part of a team to submit a proposal. Please join or create a team first.');
        }
      } catch (e) {
        console.error('Auth error:', e);
        throw new Error(e.message || 'Authentication error. Please try logging in again.');
      }
      
      // Upload files if any are selected
      let uploadedFileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setStatusMessage({
          type: 'info',
          message: 'Uploading files...'
        });
        
        uploadedFileUrls = await uploadFiles(selectedFiles);
      }
      
      // Only include fields that match the API schema
      const metadata = {
        category: data.category,
        locationMode: data.locationMode,
        state: data.state || '',
        district: data.district || '',
        city: data.city || '',
        placeVisited: data.placeVisited || '',
        travelTime: data.travelTime || '',
        executionTime: data.executionTime || '',
        completionDate: data.completionDate || '',
      };

      const payload = {
        title: data.title,
        description: data.description,
        content: data.content + '\n\n<!-- METADATA:' + JSON.stringify(metadata) + ' -->',  // Store metadata as hidden HTML comment in content
        // Optional fields
        attachment: uploadedFileUrls.join(','),  // Store multiple file URLs as comma-separated string
        link: data.gdriveLink || '',  // Store Google Drive link in the link field
        
        // Extra metadata fields (these won't be used by the API validation
        // but will be available in the raw request body)
        _metadata: metadata
      };

      console.log('Submitting payload:', payload);

      // Always use POST to /api/student/proposals - it handles both create and update logic
      const apiUrl = '/api/student/proposals';
      const method = 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        // Try to parse as JSON first
        let errorData;
        try {
          errorData = await response.json();
          console.error('Server error (JSON):', errorData);
        } catch (e) {
          // If not JSON, get as text
          const errorText = await response.text();
          console.error('Server error (Text):', errorText);
        }
        
        if (errorData?.error === 'Team not found') {
          throw new Error(`Your team information could not be found. Please make sure you have joined or created a team.`);
        } else if (errorData?.error === 'Proposal exists') {
          throw new Error(`You already have a proposal submitted. ${errorData.message || ''}`);
        } else if (errorData?.error === 'Validation failed') {
          throw new Error(`Form validation failed. Please check all required fields.`);
        } else {
          throw new Error(`Failed to submit form (${response.status}): ${errorData?.error || 'Unknown error'}`);
        }
      }

      const result = await response.json();
      console.log('Server response:', result);
      
      if (result.success) {
        const message = existingProposal 
          ? 'Proposal updated successfully! Redirecting to proposals page...'
          : 'Form submitted successfully! Redirecting to proposals page...';
          
        setStatusMessage({
          type: 'success',
          message: message
        });
        
        // Redirect to proposals page after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard/student/proposals';
        }, 2000);
      } else {
        // This shouldn't happen since we check !response.ok above, but just in case
        throw new Error(result.error || 'Unknown error occurred');
      }
      
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatusMessage({
        type: 'error',
        message: err.message || 'An unknown error occurred while submitting your form.'
      });
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show the status message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border">
          <Loader2 className="h-6 w-6 animate-spin mr-3 text-blue-600" />
          <span className="text-gray-700 font-medium">Loading existing proposal data...</span>
        </div>
      )}
      
      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-8 p-4 rounded-lg border-l-4 ${
          statusMessage.type === 'success' 
            ? 'bg-green-50 border-l-green-400 text-green-800' 
            : statusMessage.type === 'error' 
            ? 'bg-red-50 border-l-red-400 text-red-800' 
            : 'bg-blue-50 border-l-blue-400 text-blue-800'
        }`}>
          <div className="flex items-center">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            )}
            <p className="font-medium">{statusMessage.message}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Project Information Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            Project Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Title
              </label>
              <input type="hidden" {...register('title')} />
              <div className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium shadow-sm">
                {watch('title') || 'Loading...'}
              </div>
              {errors.title && <p className="text-red-600 text-sm mt-1 font-medium">{errors.title.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Project Category
              </label>
              <input type="hidden" {...register('category')} />
              <div className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium shadow-sm">
                {watch('category') || 'Loading...'}
              </div>
              {errors.category && <p className="text-red-600 text-sm mt-1 font-medium">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location Mode
              </label>
              <input type="hidden" value="Offline" {...register('locationMode')} />
              <div className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium shadow-sm">
                Offline
              </div>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
            </div>
            Location Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                {...register('state')}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setValue('district', '');
                }}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-600 text-sm mt-1 font-medium">{errors.state.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <select
                {...register('district')}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <p className="text-red-600 text-sm mt-1 font-medium">{errors.district.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('city')}
                placeholder="Enter city name"
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.city && <p className="text-red-600 text-sm mt-1 font-medium">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Place Visited <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('placeVisited')}
                placeholder="Enter specific place or venue"
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.placeVisited && <p className="text-red-600 text-sm mt-1 font-medium">{errors.placeVisited.message}</p>}
            </div>
          </div>
        </div>

        {/* Execution Details Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
            </div>
            Execution Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Travel Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2 hours 30 minutes"
                {...register('travelTime')}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.travelTime && <p className="text-red-600 text-sm mt-1 font-medium">{errors.travelTime.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Execution Time <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1 hour"
                {...register('executionTime')}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.executionTime && <p className="text-red-600 text-sm mt-1 font-medium">{errors.executionTime.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Completion <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('completionDate')}
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {errors.completionDate && <p className="text-red-600 text-sm mt-1 font-medium">{errors.completionDate.message}</p>}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
            </div>
            Project Content
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 font-normal ml-1">(minimum 100 characters)</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Provide a comprehensive description of your project..."
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                defaultValue="This is a detailed description of the project. It needs to be at least 100 characters long to pass validation. This project aims to achieve significant impact in the selected category through careful planning and execution."
              />
              {errors.description && <p className="text-red-600 text-sm mt-1 font-medium">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 font-normal ml-1">(minimum 100 characters)</span>
              </label>
              <textarea
                {...register('content')}
                rows={6}
                placeholder="Describe the implementation details, timeline, resources, and expected outcomes..."
                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                defaultValue="This is the content of the proposal which also needs to be at least 100 characters long. It contains all the details about how the project will be implemented, the timeline, resources required, and expected outcomes."
              />
              {errors.content && <p className="text-red-600 text-sm mt-1 font-medium">{errors.content.message}</p>}
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </div>
            Supporting Files <span className="text-red-500">*</span>
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  Drop files here or click to upload
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.jpg,.jpeg,.png,.gif"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-2 text-sm text-gray-600">
                PDF, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI, JPG, PNG, GIF
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Maximum file size: 50MB per file
              </p>
            </div>
          </div>
          
          {/* File Upload Error Message */}
          {fileError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{fileError}</p>
            </div>
          )}

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Selected Files:</h4>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {file.type.startsWith('image/') ? (
                          <svg className="h-10 w-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        ) : file.type === 'application/pdf' ? (
                          <svg className="h-10 w-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        ) : file.type.startsWith('video/') ? (
                          <svg className="h-10 w-10 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        ) : (
                          <svg className="h-10 w-10 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Google Drive Link Section */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm8 8a2 2 0 11-4 0 2 2 0 014 0zm-2-6a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
              </svg>
            </div>
            Google Drive Link with Photos and Videos
          </h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Google Drive Link <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 font-normal ml-1">- Share link to folder with photos/videos</span>
            </label>
            <input
              type="url"
              {...register('gdriveLink')}
              placeholder="https://drive.google.com/drive/folders/..."
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.gdriveLink && <p className="text-red-600 text-sm mt-1 font-medium">{errors.gdriveLink.message}</p>}
            <p className="text-xs text-gray-500 mt-2">
              💡 <strong>Tip:</strong> Share your Google Drive folder with photos and videos from your project execution. Make sure the link is publicly accessible.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                {existingProposal ? 'Updating...' : 'Submitting...'}
              </>
            ) : (
              existingProposal ? 'Update Proposal' : 'Submit Proposal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}