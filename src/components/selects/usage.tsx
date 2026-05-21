// // Basic usage
// const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

// const categoryOptions = [
//     { value: "plumbing", label: "Plumbing", icon: "🚰" },
//     { value: "electrical", label: "Electrical", icon: "⚡" },
//     { value: "carpentry", label: "Carpentry", icon: "🪵" },
// ];

// <SearchableSelect
//     options={categoryOptions}
//     value={selectedCategory}
//     onChange={(value, option) => setSelectedCategory(value)}
//     placeholder="Select a category"
//     searchPlaceholder="Search categories..."
//     clearable
//     highlightSelected
//     highlightColor="bg-blue-50 border-blue-200"
// />

// // With custom render
// <SearchableSelect
//     options={categoryOptions}
//     value={selectedCategory}
//     onChange={setSelectedCategory}
//     renderOption={(option, isSelected, isHighlighted) => (
//         <div className={`flex items-center gap-3 p-2 ${
//             isSelected ? "bg-green-50" : isHighlighted ? "bg-gray-100" : ""
//         }`}>
//             <span className="text-2xl">{option.icon}</span>
//             <div>
//                 <div className="font-medium">{option.label}</div>
//                 <div className="text-xs text-gray-500">{option.metadata?.description}</div>
//             </div>
//         </div>
//     )}
// />

// // Grouped version
// const groupedOptions = [
//     {
//         label: "Construction",
//         options: [
//             { value: "plumbing", label: "Plumbing", icon: "🚰" },
//             { value: "electrical", label: "Electrical", icon: "⚡" },
//         ]
//     },
//     {
//         label: "Home Services",
//         options: [
//             { value: "cleaning", label: "Cleaning", icon: "🧹" },
//             { value: "painting", label: "Painting", icon: "🎨" },
//         ]
//     }
// ];

// <SearchableSelectGrouped
//     options={groupedOptions}
//     value={selectedCategory}
//     onChange={setSelectedCategory}
//     placeholder="Select a service"
//     highlightSelected
// />

// // In your ServiceCategoryModal
// <SearchableSelect
//     options={categories.map(cat => ({
//         value: cat.id,
//         label: cat.name,
//         icon: cat.icon,
//         metadata: { description: cat.description }
//     }))}
//     value={selectedParentId}
//     onChange={(value) => setValue("parentId", value)}
//     placeholder="Select parent category"
//     clearable
//     highlightSelected
//     className="mb-4"
// />