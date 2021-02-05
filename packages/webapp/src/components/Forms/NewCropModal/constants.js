// constants for crop groups and subgroups
const CROP_GROUPS = [
  'Fruit and nuts',
  'Beverage and spice crops',
  'Potatoes and yams',
  'Vegetables and melons',
  'Cereals',
  'Leguminous crops',
  'Sugar crops',
  'Oilseed crops',
  'Other crops',
];
CROP_GROUPS.sort();

const CROP_SUBGROUPS = [
  'Fibre crops',
  'Grasses and other fodder crops',
  'Nuts',
  'Temporary spice crops',
  'Pome fruits and stone fruits',
  'High starch Root/tuber crops',
  'Leafy or stem vegetables',
  'Tropical and subtropical fruits',
  'Cereals',
  'Legumes',
  'Sugar crops (root)',
  'Citrus fruits',
  'Permanent spice crops',
  'Berries',
  'Fruit-bearing vegetables',
  'Other fruits',
  'Root, bulb, or tuberous vegetables',
  'Temporary oilseed crops',
  'Permanent oilseed crops',
  'Medicinal, aromatic, pesticidal, or similar crops',
  'Grapes',
  'Flower crops',
  'Mushrooms and truffles',
  'Rubber',
  'Sugar crops (other)',
  'Tobacco',
  'Other crops',
];
CROP_SUBGROUPS.sort();

export const CROP_DICT = {
  'Fruit and nuts': [
    'Nuts',
    'Pome fruits and stone fruits',
    'Tropical and subtropical fruits',
    'Citrus fruits',
    'Berries',
    'Grapes',
    'Other fruits',
    'Mushrooms and truffles',
  ],
  'Beverage and spice crops': ['Temporary spice crops', 'Permanent spice crops'],
  'Potatoes and yams': [],
  'Vegetables and melons': [
    'High starch Root/tuber crops',
    'Leafy or stem vegetables',
    'Fruit-bearing vegetables',
    'Root, bulb, or tuberous vegetables',
  ],
  Cereals: ['Cereals'],
  'Leguminous crops': ['Legumes'],
  'Sugar crops': ['Sugar crops (root)', 'Sugar crops (other)'],
  'Oilseed crops': ['Temporary oilseed crops', 'Permanent oilseed crops'],
  'Other crops': [
    'Other crops',
    'Fibre crops',
    'Grasses and other fodder crops',
    'Medicinal, aromatic, pesticidal, or similar crops',
    'Flower crops',
    'Rubber',
    'Tobacco',
  ],
};

// wow, are you for real?
var INITIAL_STATE = {
  show: false,
  CROP_SUBGROUPS: CROP_SUBGROUPS,
  crop_common_name: '',
  crop_genus: '',
  crop_specie: '',
  crop_group: '',
  crop_subgroup: '',
  max_rooting_depth: null,
  depletion_fraction: null,
  percentrefuse: null,
  refuse: null,
  nutrient_notes: '',
  same_crop_group: [],
  same_subgroup: [],
  avg_crop: {},
  variety: '',
  has_variety: false,
  is_avg_depth: null,
  initial_kc: null,
  mid_kc: null,
  end_kc: null,
  max_height: null,
  is_avg_kc: null,
  protein: null,
  lipid: null,
  energy: null,
  ca: null,
  fe: null,
  mg: null,
  ph: null,
  k: null,
  na: null,
  zn: null,
  cu: null,
  fl: null,
  mn: null,
  se: null,
  vita_rae: null,
  vite: null,
  vitc: null,
  thiamin: null,
  riboflavin: null,
  niacin: null,
  pantothenic: null,
  vitb6: null,
  vitk: null,
  is_avg_nutrient: false,
  nutrient_credits: null,
};

const NUTRIENT_DICT = {
  initial_kc: 'FIELDS.CROP.INIT_KC',
  mid_kc: 'FIELDS.CROP.MID_KC',
  end_kc: 'FIELDS.CROP.END_KC',
  max_height: 'FIELDS.CROP.MAX_HEIGHT',
  protein: 'FIELDS.CROP.PROTEIN',
  lipid: 'FIELDS.CROP.LIPID',
  energy: 'FIELDS.CROP.ENERGY',
  ca: 'FIELDS.CROP.CALCIUM',
  fe: 'FIELDS.CROP.IRON',
  mg: 'FIELDS.CROP.MAGNESIUM',
  ph: 'FIELDS.CROP.PH',
  k: 'FIELDS.CROP.K',
  na: 'FIELDS.CROP.NA',
  zn: 'FIELDS.CROP.ZINC',
  cu: 'FIELDS.CROP.COPPER',
  mn: 'FIELDS.CROP.MANGANESE',
  vita_rae: 'FIELDS.CROP.VITA_RAE',
  vitc: 'FIELDS.CROP.VITAMIN_C',
  thiamin: 'FIELDS.CROP.THIAMIN',
  riboflavin: 'FIELDS.CROP.RIBOFLAVIN',
  niacin: 'FIELDS.CROP.NIACIN',
  vitb6: 'FIELDS.CROP.VITAMIN_B6',
  folate: 'FIELDS.CROP.FOLATE',
  vitb12: 'FIELDS.CROP.VITAMIN_B12',
  max_rooting_depth: 'FIELDS.CROP.MAX_ROOTING',
  nutrient_credits: 'FIELDS.CROP.NUTRIENT_CREDITS',
};

const NUTRIENT_ARRAY = [
  'initial_kc',
  'mid_kc',
  'end_kc',
  'max_height',
  'max_rooting_depth',
  'protein',
  'lipid',
  'ph',
  'energy',
  'ca',
  'fe',
  'mg',
  'k',
  'na',
  'zn',
  'cu',
  'mn',
  'vita_rae',
  'vitc',
  'thiamin',
  'riboflavin',
  'niacin',
  'vitb6',
  'folate',
  'vitb12',
  'nutrient_credits',
];

// dummy new crop object with partially filled fields
var DUMMY_NEW_CROP = {
  crop_id: '',
  crop_common_name: '',
  crop_genus: '',
  crop_specie: '',
  crop_group: '',
  crop_subgroup: '',
  max_rooting_depth: 1,
  depletion_fraction: 0.5,
  is_avg_depth: null,
  initial_kc: 0.5,
  mid_kc: 0.5,
  end_kc: 0.5,
  max_height: 1,
  is_avg_kc: null,
  nutrient_notes: '',
  percentrefuse: 50,
  refuse: '',
  protein: 1,
  lipid: 1,
  energy: 1000,
  ca: 1,
  fe: 1,
  mg: 1,
  ph: 1,
  k: 1,
  na: 1,
  zn: 1,
  cu: 1,
  fl: 1,
  mn: 1,
  se: 1,
  vita_rae: 1,
  vite: 1,
  vitc: 1,
  thiamin: 1,
  riboflavin: 1,
  niacin: 1,
  pantothenic: 1,
  vitb6: 1,
  folate: 1,
  vitb12: 1,
  vitk: 1,
  is_avg_nutrient: null,
  farm_id: null,
  user_added: true,
  deleted: false,
  nutrient_credits: 0,
};

export {
  CROP_GROUPS,
  CROP_SUBGROUPS,
  DUMMY_NEW_CROP,
  INITIAL_STATE,
  NUTRIENT_DICT,
  NUTRIENT_ARRAY,
};
