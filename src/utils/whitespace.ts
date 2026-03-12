import type { SurveyData, WhitespaceItem, WhitespaceStatus } from '../types/survey';

function getStatus(vendor: string, status?: string): WhitespaceStatus {
  if (vendor === 'suiteq') return 'suiteq';
  if (vendor === 'other') return 'competitor';
  if (status === '検討中') return 'considering';
  if (status === '未導入' || status === 'none') return 'none';
  return 'unknown';
}

export function calcWhitespace(data: Partial<SurveyData>): WhitespaceItem[] {
  return [
    {
      category: 'PC・端末',
      icon: '💻',
      status: getStatus(data.pcVendor || '', ''),
      competitorName: data.pcVendorOther,
      proposalMessage: '最適なPC・端末のご提案ができます',
      urgency: data.pcVendor === 'other' ? 'medium' : data.pcVendor === 'suiteq' ? 'none' : 'low',
    },
    {
      category: 'サーバー・クラウド',
      icon: '🖥️',
      status: getStatus(data.serverVendor || '', data.serverEnv?.includes('未導入') ? '未導入' : ''),
      competitorName: data.serverVendorOther,
      proposalMessage: 'クラウド移行・サーバー構築をご支援します',
      urgency: data.serverEnv?.includes('未導入') ? 'high' : data.serverVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: '基幹システム',
      icon: '📊',
      status: getStatus(data.coreSystemVendor || '', data.coreSystemStatus),
      competitorName: data.coreSystemVendorOther,
      proposalMessage: '業務に最適な基幹システムをご提案します',
      urgency: data.coreSystemAge === '7年以上' ? 'high' : data.coreSystemStatus === '検討中' ? 'high' : data.coreSystemStatus === '未導入' ? 'medium' : 'none',
    },
    {
      category: '勤怠管理',
      icon: '⏰',
      status: getStatus(data.attendanceVendor || '', data.attendanceMethod === 'タイムカード' || data.attendanceMethod === '紙・手書き' ? '未導入' : ''),
      competitorName: data.attendanceVendorOther,
      proposalMessage: '勤怠管理システムの導入をサポートします',
      urgency: data.attendanceMethod === '紙・手書き' || data.attendanceMethod === 'タイムカード' ? 'high' : data.attendanceVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: 'セキュリティ',
      icon: '🔒',
      status: getStatus(data.securityVendor || '', data.securityStatus?.includes('未対応') ? '未導入' : ''),
      competitorName: data.securityVendorOther,
      proposalMessage: 'セキュリティ対策の強化をご支援します',
      urgency: data.securityStatus?.includes('未対応') ? 'high' : data.securityVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: 'バックアップ',
      icon: '💾',
      status: getStatus(data.backupVendor || '', data.backupStatus === 'していない' ? '未導入' : ''),
      competitorName: data.backupVendorOther,
      proposalMessage: '安全なバックアップ環境をご提案します',
      urgency: data.backupStatus === 'していない' ? 'high' : data.backupRestoreTest === 'したことない' ? 'medium' : 'none',
    },
    {
      category: '回線・ネットワーク',
      icon: '🌐',
      status: getStatus(data.networkVendor || '', ''),
      competitorName: data.networkVendorOther,
      proposalMessage: '安定した回線・ネットワーク環境をご提案します',
      urgency: data.networkVendor === 'other' ? 'medium' : 'none',
    },
    {
      category: '複合機',
      icon: '🖨️',
      status: getStatus(data.mfpVendor || '', ''),
      competitorName: data.mfpVendorOther,
      proposalMessage: '最新複合機へのリプレイスをご提案します',
      urgency: data.mfpReplaceTime === '1年以内' ? 'high' : data.mfpReplaceTime === '1〜3年' ? 'medium' : 'none',
    },
    {
      category: '電話・PBX',
      icon: '📞',
      status: getStatus(data.phoneVendor || '', ''),
      competitorName: data.phoneVendorOther,
      proposalMessage: 'クラウド電話へのリプレイスをご提案します',
      urgency: data.phoneEnv === '従来のビジネスフォン（PBX）' ? 'medium' : 'none',
    },
    {
      category: '保守・サポート',
      icon: '🔧',
      status: getStatus(data.maintenanceVendor || '', data.maintenanceStatus === '契約なし' ? '未導入' : ''),
      competitorName: data.maintenanceVendorOther,
      proposalMessage: '包括的な保守サポートをご提供します',
      urgency: (data.maintenanceExpired?.length ?? 0) > 0 ? 'high' : data.maintenanceStatus === '契約なし' ? 'high' : 'none',
    },
    {
      category: 'AI活用',
      icon: '🤖',
      status: data.aiStatus === '積極的に活用中' || data.aiStatus === '一部で活用中' ? 'suiteq' : data.aiStatus === '検討中' ? 'considering' : 'none',
      proposalMessage: 'AI導入・活用のご支援ができます',
      urgency: data.aiStatus === '検討中' ? 'medium' : data.aiStatus === 'まだ活用していない' ? 'low' : 'none',
    },
  ];
}
