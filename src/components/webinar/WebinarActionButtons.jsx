import { WB_CTA, WB_CTA_FREE, TYPE } from './tokens';

export default function WebinarActionButtons({
  onJoinPaid,
  onJoinFree,
  showUrgency = true,
  compact = false,
}) {
  return (
    <div className={`flex flex-col items-center ${compact ? 'gap-2' : 'gap-2.5'}`}>
      <button type="button" onClick={onJoinPaid} className={WB_CTA}>
        Join Masterclass — ₹99
      </button>
      <button type="button" onClick={onJoinFree} className={WB_CTA_FREE}>
        Want to join free webinar?
      </button>
      {showUrgency ? (
        <p className={`${TYPE.leadBold} ${compact ? '!text-sm' : ''} !mt-0.5`}>
          Limited seats —{' '}
          <span className="!text-red-500">book your spot today</span>
        </p>
      ) : null}
    </div>
  );
}
