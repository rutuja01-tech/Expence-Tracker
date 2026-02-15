# **App Name**: FinanceFlow

## Core Features:

- User Authentication: Secure user registration and login with protected routes using Express and React Context API.
- Transaction Management: CRUD operations for transactions: add, edit, delete, and view details.
- Dashboard Summary: Display total expenses and a breakdown by category.
- Transaction Explorer: Scalable transaction history browsing with dynamic data fetching (infinite scroll or load more).
- Search and Filter: Filter transactions by category, date, or amount, with search by text input. The UI should persist when the user navigates away, then returns to the explorer.
- Category Suggestions: AI-powered tool to suggest transaction categories based on transaction title and notes, using a generative LLM API. This tool simplifies transaction categorization.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and stability in financial management.
- Background color: Light gray (#F5F5F5), providing a clean and neutral backdrop to emphasize content.
- Accent color: Vibrant green (#4CAF50) to highlight important actions such as adding transactions and confirming operations.
- Body and headline font: 'Inter', a sans-serif font providing a clean, modern, objective look.
- Use minimalistic, clear icons for categories and actions for a user-friendly experience.
- Subtle animations when loading data or confirming actions to enhance user engagement without being intrusive.
- Maintain a clean and intuitive layout with well-organized components, making navigation straightforward.