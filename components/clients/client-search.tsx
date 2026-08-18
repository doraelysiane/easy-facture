"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export function ClientSearch({ initialValue = "", phoneNumbers = [] }: { initialValue?: string, phoneNumbers?: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q")?.toString() || "";
    
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    
    router.push(`?${params.toString()}`);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("q");
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
         <Input 
           name="q" 
           placeholder="Rechercher par numéro de téléphone..." 
           defaultValue={initialValue} 
           className="pl-9 pr-10" 
           onChange={handleInput}
           list="phones-list"
           autoComplete="off"
         />
         <datalist id="phones-list">
           {phoneNumbers.map(phone => (
             <option key={phone} value={phone} />
           ))}
         </datalist>
      </div>
    </form>
  )
}
