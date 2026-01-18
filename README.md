# Weekly Budget Planner

A React-based budget planning application that helps you manage your bills and income on a weekly basis. This app allows you to drag and drop bills into weekly budgets, track spending, and ensure bills are paid on time.

## Features

- **Drag & Drop Interface**: Easily assign bills to specific weeks by dragging and dropping
- **Bill Management**: Add, edit, delete, and toggle bills on/off
- **Income Configuration**: Set up alternating bi-weekly income patterns
- **Bill Splitting**: Split bills across multiple weeks if needed
- **Late Fee Prevention**: Visual warnings when assigning bills after their due date
- **Monthly Status Tracking**: See at a glance which months have all bills assigned
- **Data Persistence**: All data is saved to localStorage automatically
- **Visual Feedback**: Color-coded months and spending indicators

## Tech Stack

- **React 18**: Component-based UI framework
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **localStorage**: Client-side data persistence

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Week-9-
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality

## How to Use

### Setting Up Bills

1. Click the "Bill Setup" button in the header
2. Add new bills with:
   - Bill name
   - Amount
   - Due day of the month (1-31)
3. Toggle bills on/off using the checkbox
4. Edit or delete existing bills as needed

### Configuring Income

1. Click the "Income" button in the header
2. Set two income amounts:
   - Amount X (for weeks 1, 3, 5, etc.)
   - Amount Y (for weeks 2, 4, 6, etc.)
3. Click "Apply Income Pattern" to update all weeks

### Assigning Bills

1. Bills appear in the "Bills to Assign" panel on the right
2. Drag a bill and drop it onto a week
3. The app prevents late assignments (bills can't be assigned after their due date)
4. Check off bills as paid using the checkbox

### Splitting Bills

1. Click "Split" on any assigned bill
2. Enter the amount to split off
3. The remaining amount stays in the current week
4. The split amount goes back to "Bills to Assign"

### Removing Bills

1. Click the trash icon on any assigned bill
2. The bill returns to "Bills to Assign"
3. If a split bill is removed, it merges back with other split portions

## Data Storage

All data is automatically saved to localStorage including:
- Master bill list
- Assigned bills for each week
- Unassigned bills
- Income amounts
- Week configurations

Data persists across browser sessions.

## Project Structure

```
Week-9-/
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── .eslintrc.cjs          # ESLint configuration
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles with Tailwind
│   ├── components/
│   │   └── WeeklyBudgetPlanner.jsx  # Main budget planner component
│   └── utils/
│       └── storage.js     # localStorage wrapper utility
└── README.md              # This file
```

## Future Development

This app is ready for continued development. Some potential enhancements:

- Export/import budget data
- Recurring bill templates
- Budget analytics and reports
- Multi-month planning
- Budget categories
- Mobile responsiveness improvements
- Dark mode
- Print functionality

## Contributing

This project is in active development. Feel free to submit issues and enhancement requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.