import { PrimaryInput } from '@/components/ui/Input/Input'
import React, { useState } from 'react'
import { CardLayoutType, CardOptionsType } from '@/type';

interface CardDetailsProps {
  cardOption: CardLayoutType;
  setCardOption: React.Dispatch<React.SetStateAction<CardLayoutType>>;
  cardOptions: CardOptionsType
  setCardName: React.Dispatch<React.SetStateAction<string>>;
  cardName: string;
}



const CardDetails = ({setCardOption, cardOption, cardOptions, cardName, setCardName}: CardDetailsProps) => {

  return (
    <div className=' p-6'>
      <div className=' mt-7'>
        <label>Card Name</label>
        <PrimaryInput
          value={cardName}
          onChange={(e: any) => setCardName(e.target.value)}
        />
      </div>
      <div className=' mt-7'>
        <div className="mt-6">
          <span className="text-black">Select card size</span>
          <div className="flex flex-wrap">            
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${cardOption.key === cardOptions.TWO_X_TWO.key ? 'active-box' : ''}
                `}
                onClick={() => {
                  setCardOption(cardOptions.TWO_X_TWO);
                }}
              >
                <div className="card selected layout-2-2"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">2 X 2</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 box-border">
              <div
                className={`option grid border-all-active
                    ${cardOption.key === cardOptions.FOUR_X_TWO.key ? 'active-box' : ''}
                    `}
                onClick={() => {
                  setCardOption(cardOptions.FOUR_X_TWO);
                }}
              >
                <div className="card selected layout-4-2"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">4 X 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetails