import { WhitespaceItem, ProposalCard } from '../types/survey';

export function generateProposals(items: WhitespaceItem[]): ProposalCard[] {
  const proposals: ProposalCard[] = [];

  items.forEach(item => {
    if (item.status === 'suiteq') return; // スイテック取引中はスキップ

    if (item.urgency === 'high') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `【緊急】${item.category}のご提案`,
        description: item.proposalMessage,
        urgencyLabel: '早急なご対応をお勧めします',
        urgencyColor: 'red',
      });
    } else if (item.urgency === 'medium') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `${item.category}のご提案`,
        description: item.proposalMessage,
        urgencyLabel: 'ご検討をお勧めします',
        urgencyColor: 'orange',
      });
    } else if (item.urgency === 'low') {
      proposals.push({
        category: item.category,
        icon: item.icon,
        title: `${item.category}について`,
        description: item.proposalMessage,
        urgencyLabel: '将来的にご相談ください',
        urgencyColor: 'blue',
      });
    }
  });

  // 緊急度順にソート
  const order = { red: 0, orange: 1, blue: 2 };
  return proposals.sort((a, b) => order[a.urgencyColor as keyof typeof order] - order[b.urgencyColor as keyof typeof order]);
}
