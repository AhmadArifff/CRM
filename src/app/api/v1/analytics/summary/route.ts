import { NextResponse } from 'next/server';
import { KPI_SUMMARY, INITIAL_DEALS } from '../../../../../data/mockData';

export async function GET() {
  const activePipelineValue = INITIAL_DEALS
    .filter((d) => d.stageId !== 'CLOSED_WON' && d.stageId !== 'CLOSED_LOST')
    .reduce((acc, curr) => acc + curr.value, 0);

  return NextResponse.json({
    success: true,
    data: {
      kpis: KPI_SUMMARY,
      activePipelineValue,
    },
    message: 'Executive analytics data berhasil dimuat',
  });
}
