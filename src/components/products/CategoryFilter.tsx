import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useProducts';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  const { data: categories = [] } = useCategories();

  const allCategories = ['all', ...categories];

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <motion.div
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selected === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(category)}
            className={`capitalize ${selected === category ? 'btn-primary' : ''}`}
          >
            {category === 'all' ? 'All Products' : category}
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryFilter;
