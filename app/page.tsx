'use client';

import { subtitle, title } from '@/components/primitives';
import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';
import { DatePicker } from '@nextui-org/react';
import { today, getLocalTimeZone } from '@internationalized/date';
import { Input } from '@nextui-org/react';
import { useState, useEffect, SetStateAction } from 'react';
import { 
  CarPriceGasoline, 
  CarPriceDiesel, 
  CarPriceHybrid, 
  CarOptionsList 
} from './option';

export default function Home() {
  const [carEngine, setCarEngine] = useState([]);
  const [carGrade, setCarGrade] = useState([]);
  const [carColor, setCarColor] = useState([]);
  const [carSheet, setCarSheet] = useState([]);
  const [carPrice, setCarPrice] = useState(0);
  const [optionPrice, setOptionPrice] = useState(0);
  const [selectOption, setSelectOption] = useState([]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [Warning, setWarning] = useState(false);

  const EngineChange = (selectedValues: { slice: (arg0: number, arg1: number) => SetStateAction<never[]>; }) => {
    setCarEngine(selectedValues.slice(0, 1)); // 항상 첫 번째 값만 유지하여 단일 선택
    setCarGrade([]);
    setCarPrice(0);
    setOptionPrice(0);
    setSelectOption([]);
    setWarning(false);
  };

  const GradeChange = (selectedValues) => {
    if (carEngine.length === 0) {
      setWarning(true); // 엔진이 선택되지 않으면 경고 표시
    } else {
      setCarGrade(selectedValues.slice(0, 1)); // 항상 첫 번째 값만 유지하여 단일 선택
      setOptionPrice(0);
      setSelectOption([]);
      setWarning(false);
    }
  };

  const optionChange = (selectedOptions) => {
    setSelectOption(selectedOptions);
    let optionTotal = 0;
    selectedOptions.forEach((option) => {
      const optItem = CarOptionsList[carGrade[0]]?.find((item) => item.value === option);
      if (optItem) {
        optionTotal += optItem.price;
      }
    });
    setOptionPrice(optionTotal);
  };

  useEffect(() => {
    if (carEngine.length > 0 && carGrade.length > 0) {
      const engine = carEngine[0];
      const priceList =
        engine === "gasoline" ? CarPriceGasoline
          : engine === "diesel" ? CarPriceDiesel
          : engine === "hybrid" ? CarPriceHybrid
          : [];

      const selectedGrade = priceList.find((item) => item.name === carGrade[0]);
      let basePrice = selectedGrade?.price || 0;
      // 차량 색상이 스노우 화이트 펄(SWP)인 경우 80,000 추가
      if (carColor.includes("color1")) {
        basePrice += 80000;
      }
      setCarPrice(basePrice + optionPrice);
    }
  }, [carEngine, carGrade, carColor, optionPrice]);
  
  function CustomerInfo() {
    return (
      <>
        <h5>고객명</h5>
        <Input 
          type="text" 
          placeholder="성함"
          />
        <br />
        <h5>고객 연락처</h5>
        <Input 
          type="tel" 
          placeholder="연락처"
          />
        <br />
        <h5>견적일</h5>
        <DatePicker aria-label="Date (Min Date Value)"
                      defaultValue={today(getLocalTimeZone())}
                      variant="bordered"
        />
      </>
    )
  }
  
  function Engine() {
    return (
      <>
        <h5>엔진 선택</h5>
        <CheckboxGroup
          label="엔진을 선택해주세요."
          orientation="horizontal"
          value={carEngine}
          onChange={EngineChange}
        >
          <Checkbox value="gasoline">3.5 가솔린</Checkbox>
          <Checkbox value="diesel">2.2 디젤</Checkbox>
          <Checkbox value="hybrid">1.6 하이브리드</Checkbox>
        </CheckboxGroup>
      </>
    );
  }

  function CarGrade() {
    return (
      <>
        <h5>차량 등급</h5>
        <CheckboxGroup
          label="차량 등급을 선택해주세요."
          orientation="horizontal"
          value={carGrade}
          onChange={GradeChange}
        >
          <Checkbox value="Prestige">프레스티지</Checkbox>
          <Checkbox value="Noble">노블레스</Checkbox>
          <Checkbox value="Signature">시그니처</Checkbox>
          <Checkbox value="Gravity">그래비티</Checkbox>
        </CheckboxGroup>
      </>
    );
  }

  function CarColor() {
    return (
      <>
        <h5>차량 색상</h5>
        <CheckboxGroup
          label="차량 등급마다 선택할 수 있는 색상에 차이가 있습니다."
          orientation="horizontal"
          value={carColor}
          onChange={(selectedValues) => setCarColor(selectedValues.slice(0, 1))} // 단일 선택 유지
        >
          <Checkbox value="color1">스노우 화이트 펄(SWP) (+80,000)</Checkbox>
          {!carGrade.includes("Gravity") && (
            <Checkbox value="color2">아이보리 실버(ISG)</Checkbox>
          )}
          <Checkbox value="color3">오로라 블랙 펄(ABP)</Checkbox>
          {!carGrade.includes("Gravity") && (
            <Checkbox value="color4">판테라 메탈(P2M)</Checkbox>
          )}
          {!carGrade.includes("Prestige") &&
            !carGrade.includes("Noble") &&
            !carGrade.includes("Signature") && (
              <Checkbox value="color5">세라믹 실버(C4S)</Checkbox>
            )}
        </CheckboxGroup>
      </>
    );
  }

  function CarSheet() {
    return (
      <>
        <h5>시트 색상</h5>
        <CheckboxGroup
          label="차량 엔진마다 선택할 수 있는 색상에 차이가 있습니다."
          orientation="horizontal"
          value={carSheet}
          onChange={(selectedValues) => setCarSheet(selectedValues.slice(0, 1))}
        >
          <Checkbox value="sheet1">토프</Checkbox>
          {!carGrade.includes("Prestige") &&(
            <>
              <Checkbox value="sheet2">코튼 베이지</Checkbox>
              {!carGrade.includes("Noble") && !carEngine.includes("gasoline") && !carEngine.includes("diesel") && !carEngine.includes("Signature") &&(
                <Checkbox value="sheet3">네이비 그레이</Checkbox>
              )}
            </>
          )}
        </CheckboxGroup>
      </>
    );
  }

  function CarOptions() {
    if (carGrade.includes("Prestige")) {
      return <CarOption_Prestige />;
    } else if (carGrade.includes("Noble")) {
      return <CarOption_Noble />;
    } else if (carGrade.includes("Signature")) {
      return <CarOption_Signature />;
    } else if (carGrade.includes("Gravity")) {
      return <CarOption_Gravity />;
    }
    return null;
  }

  function CarOption_Prestige() {
    const options1 = CarOptionsList[carGrade[0]] || [];
    return (
      <>
        <h5>옵션 선택</h5>
        <CheckboxGroup
          label="차량의 상세 옵션을 정해주세요."
          orientation="horizontal"
          value={selectOption}
          onChange={optionChange}
        >
          {options1.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.name} (+{opt.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
      </>
    );
  }

  function CarOption_Noble() {
    const options2 = CarOptionsList[carGrade[0]] || [];
    return (
      <>
        <h5>옵션 선택</h5>
        <CheckboxGroup
          label="차량의 상세 옵션을 정해주세요."
          orientation="horizontal"
          value={selectOption}
          onChange={optionChange}
        >
          {options2.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.name} (+{opt.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
      </>
    );
  }

  function CarOption_Signature() {
    const options3 = CarOptionsList[carGrade[0]] || [];
    return (
      <>
        <h5>옵션 선택</h5>
        <CheckboxGroup
          label="차량의 상세 옵션을 정해주세요."
          orientation="horizontal"
          value={selectOption}
          onChange={optionChange}
        >
          {options3.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.name} (+{opt.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
      </>
    );
  }

  function CarOption_Gravity() {
    const options4 = CarOptionsList[carGrade[0]] || [];
    return (
      <>
        <h5>옵션 선택</h5>
        <CheckboxGroup
          label="차량의 상세 옵션을 정해주세요."
          orientation="horizontal"
          value={selectOption}
          onChange={optionChange}
        >
          {options4.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.name} (+{opt.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
      </>
    );
  }

  return (
    <section className="mx-4 mt-2 flex flex-col gap-2">
    {/*<h1 className={title({ color: "blue" })}>-제목-</h1>*/}
      <br />
      <CustomerInfo
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
      /> 
      <br />
      <Engine />
      <br />
      {Warning && <p style={{ color: "red" }}>엔진을 먼저 선택해주세요.</p>}
      <CarGrade />
      <br />
      <CarColor />
      <br />
      <CarSheet />
      <br />
      <CarOptions />
      <h5 className={subtitle()}>총 금액 {`${carPrice.toLocaleString()}`}원</h5>
    </section>
  );
}
