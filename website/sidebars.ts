import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Strategy',
      collapsed: false,
      items: [
        'strategy/vision',
        'strategy/prerequisites',
        'strategy/team-topologies',
        'strategy/maturity-model',
      ],
    },
    {
      type: 'category',
      label: 'Principles',
      collapsed: false,
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
    {
      type: 'category',
      label: 'Reference Architecture',
      collapsed: false,
      items: [
        'reference-architecture/target-architecture',
        'reference-architecture/patterns',
        'reference-architecture/guardrails',
        'reference-architecture/anti-patterns',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'USAGE',
        'STRUCTURE',
        'ABOUT',
      ],
    },
  ],
};

export default sidebars;
