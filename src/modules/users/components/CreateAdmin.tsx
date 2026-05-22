// import { useEffect, useState } from "react";
// import { X, Loader2, Eye, EyeOff } from "lucide-react";
// import { Button } from "../../../components/ui/button";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useCreateAdminMutation } from "../userApiSlice";
// import { handleApiError } from "../../../utils/functions";
// import { toast } from "react-toastify";

// // Schema
// const schema = z.object({
//     email: z.string().email("Invalid email address"),
//     password: z.string().min(8, "Password must be at least 8 characters"),
//     firstName: z.string().min(2, "First name is required"),
//     lastName: z.string().min(2, "Last name is required"),
//     middleName: z.string().optional(),
//     phone: z.string().min(10, "Phone number is required"),
//     alternativePhone: z.string().optional(),
//     gender: z.enum(["male", "female"]).default("male"),
//     dateOfBirth: z.string().min(1, "Date of birth is required"),
//     preferredLanguage: z.enum(["english", "french", "spanish", "pidgin", "yoruba", "hausa", "igbo"]).default("english"),
//     avatar: z.string().url().optional().or(z.literal("")),
//     isCustomer: z.literal(false),
// });

// type FormData = z.infer<typeof schema>;

// interface Props {
//     isOpen: boolean;
//     onClose: () => void;
//     onSuccess: () => void;
// }

// export default function CreateAdminUser({
//     isOpen,
//     onClose,
//     onSuccess,
// }: Props) {
//     const [showPassword, setShowPassword] = useState(false);
//     const [createAdmin, { isLoading }] = useCreateAdminMutation();

//     const {
//         register,
//         handleSubmit,
//         reset,
//         watch,
//         formState: { errors, isSubmitting },
//     } = useForm<FormData>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             preferredLanguage: "english",
//             gender: "male",
//             isCustomer: false,
//         },
//     });

//     const formValues = watch();

//     useEffect(() => {
//         if (isOpen) {
//             reset();
//         }
//     }, [isOpen, reset]);

//     const onSubmit = async (data: FormData) => {
//         try {
//             await createAdmin({
//                 ...data,
//                 metadata: {},
//             }).unwrap();

//             toast.success("Admin user created successfully");
//             onSuccess();
//             onClose();
//         } catch (error) {
//             console.error("Failed to create admin:", error);
//             handleApiError(error);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <>
//             {/* Backdrop */}
//             <div
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
//                 onClick={onClose}
//             />

//             {/* Modal */}
//             <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
//                 {/* Header */}
//                 <div className="sticky top-0 bg-card border-b border-background px-6 py-4 flex items-center justify-between">
//                     <div>
//                         <h2 className="text-xl font-semibold">Create Admin User</h2>
//                         <p className="text-sm text-muted-foreground mt-1">
//                             Add a new administrator to the platform
//                         </p>
//                     </div>
//                     <button
//                         onClick={onClose}
//                         className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
//                     >
//                         <X className="w-5 h-5 text-red-500" />
//                     </button>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="p-6 space-y-6">
//                         {/* Full Name Section */}
//                         <div className="space-y-4">
//                             <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* First Name */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         First Name *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         {...register("firstName")}
//                                         placeholder="e.g., John"
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.firstName ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     {errors.firstName && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
//                                     )}
//                                 </div>

//                                 {/* Last Name */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         Last Name *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         {...register("lastName")}
//                                         placeholder="e.g., Doe"
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.lastName ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     {errors.lastName && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Middle Name */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Middle Name (Optional)
//                                 </label>
//                                 <input
//                                     type="text"
//                                     {...register("middleName")}
//                                     placeholder="e.g., Michael"
//                                     className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
//                                 />
//                             </div>
//                         </div>

//                         {/* Contact Information */}
//                         <div className="space-y-4">
//                             <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* Email */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         Email *
//                                     </label>
//                                     <input
//                                         type="email"
//                                         {...register("email")}
//                                         placeholder="admin@example.com"
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.email ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     {errors.email && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
//                                     )}
//                                     <p className="text-xs text-muted-foreground mt-1">
//                                         {formValues.email?.length || 0} characters
//                                     </p>
//                                 </div>

//                                 {/* Phone */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         Phone Number *
//                                     </label>
//                                     <input
//                                         type="tel"
//                                         {...register("phone")}
//                                         placeholder="+234 123 456 7890"
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.phone ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     {errors.phone && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Alternative Phone */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Alternative Phone (Optional)
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     {...register("alternativePhone")}
//                                     placeholder="+234 123 456 7890"
//                                     className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
//                                 />
//                             </div>
//                         </div>

//                         {/* Security */}
//                         <div className="space-y-4">
//                             <h3 className="text-sm font-medium text-muted-foreground">Security</h3>
                            
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Password *
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         {...register("password")}
//                                         placeholder="Enter a strong password"
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors pr-10 ${
//                                             errors.password ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                                     >
//                                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                                     </button>
//                                 </div>
//                                 {errors.password && (
//                                     <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
//                                 )}
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                     Password must be at least 8 characters
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Additional Information */}
//                         <div className="space-y-4">
//                             <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* Gender */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         Gender *
//                                     </label>
//                                     <select
//                                         {...register("gender")}
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.gender ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     >
//                                         <option value="">Select Gender</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                     </select>
//                                     {errors.gender && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>
//                                     )}
//                                 </div>

//                                 {/* Date of Birth */}
//                                 <div>
//                                     <label className="block text-sm font-medium mb-1">
//                                         Date of Birth *
//                                     </label>
//                                     <input
//                                         type="date"
//                                         {...register("dateOfBirth")}
//                                         className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
//                                             errors.dateOfBirth ? "border-red-500" : "border-muted-card"
//                                         }`}
//                                     />
//                                     {errors.dateOfBirth && (
//                                         <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth.message}</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Preferred Language */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Preferred Language
//                                 </label>
//                                 <select
//                                     {...register("preferredLanguage")}
//                                     className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
//                                 >
//                                     <option value="english">English</option>
//                                     <option value="french">French</option>
//                                     <option value="spanish">Spanish</option>
//                                     <option value="pidgin">Pidgin</option>
//                                     <option value="yoruba">Yoruba</option>
//                                     <option value="hausa">Hausa</option>
//                                     <option value="igbo">Igbo</option>
//                                 </select>
//                             </div>

//                             {/* Avatar URL */}
//                             <div>
//                                 <label className="block text-sm font-medium mb-1">
//                                     Avatar URL (Optional)
//                                 </label>
//                                 <input
//                                     type="url"
//                                     {...register("avatar")}
//                                     placeholder="https://example.com/avatar.jpg"
//                                     className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
//                                 />
//                                 <p className="text-xs text-muted-foreground mt-1">
//                                     Enter a valid image URL for the admin's profile picture
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Form Errors Summary */}
//                         {Object.keys(errors).length > 0 && (
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                                 <p className="text-sm text-red-600">
//                                     Please fix the following errors before submitting:
//                                 </p>
//                                 <ul className="text-xs text-red-500 mt-1 list-disc list-inside">
//                                     {Object.entries(errors).map(([key, error]) => (
//                                         <li key={key}>
//                                             {key}: {error?.message}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         )}
//                     </div>

//                     {/* Footer Actions */}
//                     <div className="sticky bottom-0 bg-card px-6 py-4 border-t border-background flex items-center justify-end gap-3">
//                         <Button variant="ghost" onClick={onClose} type="button">
//                             Cancel
//                         </Button>
//                         <Button type="submit" disabled={isSubmitting || isLoading}>
//                             {(isSubmitting || isLoading) ? (
//                                 <>
//                                     <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                                     Creating...
//                                 </>
//                             ) : (
//                                 "Create Admin"
//                             )}
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// }