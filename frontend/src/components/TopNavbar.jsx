import React from 'react';

const messages = [
  '🏆 FREE DELIVERY ON ALL ORDERS ABOVE ₹1499',
  '⚡ NEW ARRIVALS — UP TO 30% OFF ON SPORTS GEAR',
  '🔥 LIMITED TIME: BUY 2 GET 1 FREE ON ALL JERSEYS',
  '🎽 EXCLUSIVE COLLECTION — SHOP NOW',
  '🚴 CYCLING GEAR — NEW DROPS EVERY FRIDAY',
];

const all = [...messages, ...messages].join('   •   ');

const TopNavbar = () => {
  return (
    <div className="bg-[#0D1B2A] text-white h-[42px] flex items-center overflow-hidden">
      <div className="flex-1 marquee-wrapper px-2">
        <div className="marquee-inner text-[11px] font-bold tracking-[0.12em] uppercase text-[#00C896]">
          {all}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{all}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
