import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { LOCATION, NEEDS_PLAN, STATUS, SUPPLIERS } from '../Filter/CropCatalogue/constants';
import { cropCatalogueFilterSelector } from '../filterSlice';

export default function useFilterNoPlan(crops) {
  const cropCatalogueFilter = useSelector(cropCatalogueFilterSelector);
  const filteredByStatus = useMemo(() => {
    const statusFilter = cropCatalogueFilter[STATUS];
    const included = new Set();
    for (const status in statusFilter) {
      if (statusFilter[status].active) included.add(status);
    }
    if (included.size === 0 || statusFilter[NEEDS_PLAN]) return crops;
    return [];
  }, [cropCatalogueFilter[STATUS], crops]);

  const filteredBySupplier = useMemo(() => {
    const supplierFilter = cropCatalogueFilter[SUPPLIERS];
    const included = new Set();
    for (const supplier in supplierFilter) {
      if (supplierFilter[supplier].active) included.add(supplier);
    }
    if (included.size === 0) return filteredByStatus;
    return filteredByStatus.filter((crop) => included.has(crop.supplier));
  }, [cropCatalogueFilter[SUPPLIERS], filteredByStatus]);

  const filteredByLocation = useMemo(() => {
    const locationFilter = cropCatalogueFilter[LOCATION];
    for (const location in locationFilter) {
      if (locationFilter[location].active) return [];
    }
    return filteredBySupplier;
  }, [cropCatalogueFilter[LOCATION], filteredBySupplier]);

  return filteredByLocation;
}