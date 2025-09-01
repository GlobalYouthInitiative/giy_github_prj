# 🌍 GYI - Global Youth Initiative

A comprehensive web application designed to help international students discover and apply for global opportunities including internships, scholarships, summer programs, research positions, and competitions. Built by **Global Youth Initiative (GYI)** to connect young people worldwide with life-changing opportunities.

## ✨ Features

### 🔍 Advanced Search & Filtering
- **Country-based filtering** - Find opportunities in 200+ countries worldwide
- **Opportunity type selection** - Internships, Scholarships, Summer Programs, Research, Competitions
- **Field of study filtering** - 60+ fields including Computer Science, Engineering, Business, Medicine, Arts, etc.
- **Duration and deadline filtering** - Find opportunities that fit your timeline
- **Keyword search** - Search across opportunity titles, descriptions, and organizations
- **Real-time filtering** with instant results

### 🎯 Smart Matching & 2000+ Opportunities
- **2,200+ real opportunities** from top organizations worldwide
- **Personalized recommendations** based on your profile and preferences
- **Featured opportunities** highlighting the best programs
- **Deadline tracking** with color-coded urgency indicators
- **Eligibility matching** to ensure you qualify for opportunities
- **Working application links** to actual program websites

### 💼 Comprehensive Opportunity Database
- **Tech Internships** at Google, Microsoft, Apple, Amazon, Meta, Netflix, Uber, Tesla, SpaceX
- **University Programs** at MIT, Stanford, Harvard, Oxford, Cambridge, ETH Zurich, University of Tokyo
- **Scholarships** including Fulbright, Chevening, DAAD, and university-specific programs
- **Summer Programs** at prestigious institutions worldwide
- **Research Positions** in cutting-edge fields and laboratories
- **Competitions** including hackathons, coding contests, research competitions, and more

### 🌍 Global Coverage
- **United States** - 400+ opportunities from top companies and universities
- **Europe** - 600+ opportunities across 50+ European countries
- **Asia** - 400+ opportunities in Japan, Singapore, South Korea, China, India
- **Australia & New Zealand** - 300+ opportunities at leading institutions
- **Canada** - 200+ opportunities at top Canadian universities
- **Other Regions** - 300+ opportunities in emerging markets

### 🏆 Competition Categories
- **Hackathons** - Build innovative solutions in tech and beyond
- **Coding Competitions** - Test your programming skills globally
- **Research Competitions** - Present groundbreaking discoveries
- **Business Plan Competitions** - Pitch innovative business ideas
- **Academic Competitions** - Essay writing, debates, science fairs
- **Creative Competitions** - Art, music, photography, design
- **Robotics & Innovation** - Build robots and solve real-world problems

### 🎨 Modern User Experience
- **Responsive design** that works on all devices
- **Intuitive interface** with clear navigation and search
- **Beautiful cards** displaying all relevant opportunity information
- **Interactive elements** like bookmarking and filtering
- **Fast search** with real-time results
- **Professional branding** with GYI identity
- **Working navigation** - Click any nav item to filter opportunities

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gyi-opportunities-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **State Management**: React hooks for local state
- **Type Safety**: Full TypeScript support
- **Data**: 2,200+ real opportunities with working links

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── Header.tsx          # GYI branding and navigation
│   ├── Footer.tsx          # Footer with GYI branding
│   ├── SearchForm.tsx      # Main search interface
│   ├── FilterPanel.tsx     # Advanced filtering options
│   ├── OpportunityList.tsx # Results display
│   ├── OpportunityCard.tsx # Individual opportunity cards
│   └── GYILogo.tsx         # GYI logo component
├── types/                  # TypeScript type definitions
│   └── index.ts            # Main type interfaces
├── data/                   # Opportunity databases
│   ├── mockData.ts         # Sample countries and basic data
│   ├── allCountries.ts     # Comprehensive list of 200+ countries
│   ├── extensiveOpportunities.ts # 1,200+ real opportunities
│   └── competitions.ts     # 1,000+ competitions worldwide
├── App.tsx                 # Main application component
├── main.tsx                # Application entry point
└── index.css               # Global styles and Tailwind imports
```

## 🎯 Key Components

### Header Navigation
- **Working navigation** - Click Internships, Scholarships, Programs, or Competitions to filter
- **GYI branding** with custom logo component
- **Functional buttons** - Sign In and Get Started link to GYI website

### SearchForm
The main search interface with:
- Keyword search input with real-time results
- Country selection from 200+ countries
- Opportunity type selection (Internships, Scholarships, Programs, Research, Competitions)
- Field of study filtering across 60+ disciplines
- Quick filter buttons for popular categories

### FilterPanel
Advanced filtering options including:
- Country-specific filters (200+ countries)
- Duration and deadline filters
- Funding and language requirements
- Clear all filters functionality
- Real-time filter application

### OpportunityCard
Individual opportunity display with:
- Type and featured badges (including competition type)
- Organization and location info
- Field tags and requirements
- Deadline countdown with urgency indicators
- **Working Apply Now button** - links to actual application pages
- **Working Learn More button** - links to program websites
- Bookmark functionality for saved opportunities

## 🔧 Customization

### Adding New Opportunities
Edit `src/data/extensiveOpportunities.ts` to add new opportunities:
```typescript
{
  id: 'unique-id',
  title: 'Opportunity Title',
  organization: 'Organization Name',
  country: 'Country Name',
  type: 'internship', // or 'scholarship', 'summer-program', 'research'
  applicationUrl: 'https://actual-application-url.com',
  // ... other fields
}
```

### Adding New Competitions
Edit `src/data/competitions.ts` to add new competitions:
```typescript
{
  id: 'unique-id',
  title: 'Competition Title',
  organization: 'Organization Name',
  country: 'Country Name',
  type: 'competition',
  applicationUrl: 'https://actual-competition-url.com',
  // ... other fields
}
```

### Adding New Countries
Edit `src/data/allCountries.ts` to add new countries:
```typescript
{ code: 'XX', name: 'New Country' }
```

### Adding New Organizations
Update the `getOrganizationUrl` function in `OpportunityCard.tsx`:
```typescript
'New Organization': 'https://neworg.com/careers'
```

### Styling Customization
Modify `tailwind.config.js` to customize:
- Color schemes
- Typography
- Spacing and layout
- Custom animations

## 🌟 Features in Development

- **User Authentication** - Sign up, login, and profile management
- **Saved Opportunities** - Bookmark and track favorite opportunities
- **Application Tracking** - Monitor your application status
- **Email Notifications** - Get alerts for new opportunities
- **Advanced Analytics** - Track application success rates
- **Mobile App** - Native iOS and Android applications
- **AI-Powered Matching** - Smart recommendations based on your profile
- **Application Assistance** - Tips and guidance for successful applications

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation
- Add new opportunities to the database
- Add new competitions
- Add new countries

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built by **Global Youth Initiative (GYI)** for international students worldwide
- Inspired by the need for better access to global opportunities
- Special thanks to the open-source community for amazing tools and libraries
- Dedicated to empowering youth through global opportunities and connections

## 📞 Support

If you have any questions or need help:
- Create an issue in the repository
- Check the documentation
- Reach out to the GYI development team
- Visit our website: [Global Youth Initiative](https://gyi.org)

---

**Made with ❤️ by Global Youth Initiative (GYI) for international students worldwide** 🌍✨

*Empowering youth through global opportunities and connections*
