import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { LeadFilters } from "@/types/crm";

interface SearchAndFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
}

export const SearchAndFilters = ({ filters, onFiltersChange }: SearchAndFiltersProps) => {
  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      faturamento: "",
      cargo: "",
      nicho: "",
      dateRange: "",
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.faturamento || 
    filters.cargo || 
    filters.nicho || 
    filters.dateRange;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.faturamento}
          onValueChange={(value) => onFiltersChange({ ...filters, faturamento: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Faturamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="0-10k">0-10k</SelectItem>
            <SelectItem value="10k-50k">10k-50k</SelectItem>
            <SelectItem value="50k-100k">50k-100k</SelectItem>
            <SelectItem value="100k+">100k+</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.cargo}
          onValueChange={(value) => onFiltersChange({ ...filters, cargo: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="CEO">CEO</SelectItem>
            <SelectItem value="Diretor">Diretor</SelectItem>
            <SelectItem value="Gerente">Gerente</SelectItem>
            <SelectItem value="Empreendedor">Empreendedor</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.dateRange}
          onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearFilters}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
