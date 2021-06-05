import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../Layout';
import PageTitle from '../PageTitle/v2';
import { Underlined } from '../Typography';
import { useTranslation } from 'react-i18next';
import Filter from '../Filter';
import Button from '../Form/Button';
import { cloneObject } from '../../util';

const PureFilterPage = ({ title, filters, onApply, filterRef, onGoBack }) => {
  const { t } = useTranslation();

  const initFilterPageState = {};
  for (const filter of filters) {
    const initFilterState = {};
    for (const option of filter.options) {
      initFilterState[option.value] = {
        active: option.default,
        label: option.label,
      };
    }
    initFilterPageState[filter.filterKey] = initFilterState;
  }
  const [filterPageState, setFilterPageState] = useState(initFilterPageState);

  const updateFilter = (filterKey, value) => {
    setFilterPageState((prev) => {
      const change = cloneObject(prev);
      change[filterKey][value].active = !prev[filterKey][value].active;
      return change;
    });
  };

  const resetFilter = () => {
    setFilterPageState((prev) => {
      const change = filterResetHelper(cloneObject(prev));
      return change;
    });
  };

  return (
    <Layout
      buttonGroup={
        <Button disabled={false} onClick={onApply} fullLength>
          {t('common:APPLY')}
        </Button>
      }
    >
      <PageTitle title={title} onGoBack={onGoBack} />

      <div style={{ margin: '24px 0' }}>
        <Underlined style={{ color: '#AA5F04' }} onClick={() => resetFilter()}>
          {t('FILTER.CLEAR_ALL_FILTERS')}
        </Underlined>
      </div>

      {filters.map((filter) => {
        if (filter.options.length !== 0)
          return (
            <Filter
              subject={filter.subject}
              items={filter.options}
              filterKey={filter.filterKey}
              style={{ marginBottom: '24px' }}
              filterRef={filterRef}
              filterState={filterPageState[filter.filterKey]}
              updateFilter={updateFilter}
              key={filter.filterKey}
            />
          );
      })}
    </Layout>
  );
};

PureFilterPage.prototype = {
  subject: PropTypes.string,
  items: PropTypes.array,
  onGoBack: PropTypes.func,
};

export default PureFilterPage;

// // TRUST THE NATURAL RECURSION
// const recursiveFilterReset = (filter) => {
//   Object.keys(filter).forEach((key) => {
//     const value = filter[key];
//     if (typeof value === 'boolean') {
//       filter[key] = false;
//     } else {
//       filter[key] = recursiveFilterReset(value);
//     }
//   });
//   return filter;
// };

const filterResetHelper = (filter) => {
  for (const filterKey in filter) {
    const filterContents = filter[filterKey];
    for (const filterValue in filterContents) {
      const filterItem = filterContents[filterValue];
      filterItem.active = false;
    }
  }
  return filter;
};