import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  strategySidebar: [
    {
      type: 'category',
      label: 'Strategy',
      items: [
        'strategy/vision',
        'strategy/prerequisites',
        'strategy/team-topologies',
        'strategy/target-architecture',
        'strategy/maturity-model',
      ],
    },
  ],
  principlesSidebar: [
    {
      type: 'category',
      label: 'Principles',
      link: {
        type: 'doc',
        id: 'principles/principles',
      },
      items: [
        'principles/domain-ownership-guide',
        'principles/data-ownership-guide',
        'principles/contract-first-guide',
      ],
    },
  ],
};

export default sidebars;
