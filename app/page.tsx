'use client';

import { CheckboxGroup, Checkbox } from '@nextui-org/checkbox';
import { DatePicker } from '@nextui-org/react';
import { today, getLocalTimeZone } from '@internationalized/date';
import { Input } from '@nextui-org/react';
import { Image } from '@nextui-org/image';
import { useState, useEffect } from 'react';

import {
  CarPriceGasoline,
  CarPriceDiesel,
  CarPriceHybrid,
  CarOptionsList
} from './option';

import { LoopSelect, PackageSelect } from './swoption';

export default function Home() {
  const [carEngine, setCarEngine] = useState([]);
  const [carGrade, setCarGrade] = useState([]);
  const [carColor, setCarColor] = useState([]);
  const [carSheet, setCarSheet] = useState([]);
  const [carPrice, setCarPrice] = useState(0);
  const [optionPrice, setOptionPrice] = useState(0);
  const [swOption, setSWOption] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState([]);
  const [selectOption, setSelectOption] = useState([]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [Warning, setWarning] = useState(false);

  const resetSelections = () => {
    setOptionPrice(0);
    setSelectOption([]);
    setSWOption([]);
    setSelectedPackage([]);
  };

  const EngineChange = (selectedValues) => {
    setCarEngine(selectedValues.slice(0, 1));
    resetSelections();
  };

  const GradeChange = (selectedValues) => {
    if (carEngine.length === 0) {
      setWarning(true);
    } else {
      setCarGrade(selectedValues.slice(0, 1));
      resetSelections();
      setWarning(false);
    }
  };

  const handleOptionChange = (selectedValues) => {
    setSelectOption(selectedValues);

    let totalOptionPrice = 0;
    selectedValues.forEach((option) => {
      const optItem = CarOptionsList[carGrade[0]]?.find(
        (item) => item.value === option
      );
      if (optItem) {
        totalOptionPrice += optItem.price;
      }
    });
    setOptionPrice(totalOptionPrice);
  };

  const handleSWOptionChange = (selectedValues) => {
    setSWOption(selectedValues.slice(0, 1));
    setSelectedPackage([]);
  };

  const handlePackageChange = (selectedValue) => {
    setSelectedPackage(selectedValue.slice(0, 1));
  };

  useEffect(() => {
    let totalPrice = 0;

    if (carEngine.length > 0 && carGrade.length > 0) {
      const engine = carEngine[0];
      const priceList =
        engine === 'gasoline'
          ? CarPriceGasoline
          : engine === 'diesel'
          ? CarPriceDiesel
          : engine === 'hybrid'
          ? CarPriceHybrid
          : [];

      const selectedGrade = priceList.find((item) => item.name === carGrade[0]);
      totalPrice += selectedGrade?.price || 0;

      if (carColor.includes('color1')) {
        totalPrice += 80000;
      }
    }

    selectOption.forEach((option) => {
      const optItem = CarOptionsList[carGrade[0]]?.find(
        (item) => item.value === option
      );
      if (optItem) totalPrice += optItem.price;
    });

    swOption.forEach((option) => {
      const loopItem = LoopSelect.find((item) => item.value === option);
      if (loopItem) totalPrice += loopItem.price;
    });

    selectedPackage.forEach((pkg) => {
      const packageList = PackageSelect[swOption[0]] || [];
      const packageItem = packageList.find((item) => item.value === pkg);
      if (packageItem) totalPrice += packageItem.price;
    });

    setCarPrice(totalPrice);
  }, [carEngine, carGrade, carColor, selectOption, swOption, selectedPackage]);

  function CustomerInfo() {
    return (
      <>
        <h5>고객명</h5>
        <Input placeholder="성함" type="text" />
        <br />
        <h5>고객 연락처</h5>
        <Input placeholder="연락처" type="tel" />
        <br />
        <h5>견적일</h5>
        <DatePicker
          aria-label="Date (Min Date Value)"
          defaultValue={today(getLocalTimeZone())}
          variant="bordered"
        />
      </>
    );
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
          label="차량 등급마다 선택할 수 있는 색상에 차이가 있어요."
          orientation="horizontal"
          value={carColor}
          onChange={(selectedValues) => setCarColor(selectedValues.slice(0, 1))} // 단일 선택 유지
        >
          <Checkbox value="color1">스노우 화이트 펄(SWP) (+80,000)</Checkbox>
          {!carGrade.includes('Gravity') && (
            <Checkbox value="color2">아이보리 실버(ISG)</Checkbox>
          )}
          <Checkbox value="color3">오로라 블랙 펄(ABP)</Checkbox>
          {!carGrade.includes('Gravity') && (
            <Checkbox value="color4">판테라 메탈(P2M)</Checkbox>
          )}
          {!carGrade.includes('Prestige') &&
            !carGrade.includes('Noble') &&
            !carGrade.includes('Signature') && (
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
          label="차량 엔진마다 선택할 수 있는 색상에 차이가 있어요."
          orientation="horizontal"
          value={carSheet}
          onChange={(selectedValues) => setCarSheet(selectedValues.slice(0, 1))}
        >
          <Checkbox value="sheet1">토프</Checkbox>
          {!carGrade.includes('Prestige') && (
            <>
              <Checkbox value="sheet2">코튼 베이지</Checkbox>
              {!carGrade.includes('Noble') &&
                !carEngine.includes('gasoline') &&
                !carEngine.includes('diesel') &&
                !carEngine.includes('Signature') && (
                  <Checkbox value="sheet3">네이비 그레이</Checkbox>
                )}
            </>
          )}
        </CheckboxGroup>
      </>
    );
  }

  function CarOptions() {
    const options = CarOptionsList[carGrade[0]] || [];
    return (
      <>
        <h5>차량 옵션 선택</h5>
        <CheckboxGroup
          label="차량 옵션을 선택해주세요."
          orientation="horizontal"
          value={selectOption}
          onChange={handleOptionChange}
        >
          {options.map((opt) => (
            <Checkbox key={opt.value} value={opt.value}>
              {opt.name} (+{opt.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
      </>
    );
  }

  function SWOptions() {
    return (
      <>
        <h5>SW 옵션 선택</h5>
        <CheckboxGroup
          label="SW 옵션을 선택해주세요."
          orientation="horizontal"
          value={swOption}
          onChange={(selectedValues) => setSWOption(selectedValues.slice(0, 1))} // 단일 선택
        >
          {LoopSelect.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.name} (+{option.price.toLocaleString()} 원)
            </Checkbox>
          ))}
        </CheckboxGroup>
        {/* 선택된 SW 옵션에 따라 패키지 옵션 표시 */}
        {swOption.length > 0 && <PackageOptions />}
      </>
    );
  }
  
  function PackageOptions() {
    const isGasolineAndValidGrade =
      carEngine.includes('gasoline') &&
      ['Noble', 'Signature', 'Gravity'].some((grade) => carGrade.includes(grade));
  
    // 패키지 리스트를 가져옴
    const packageList = PackageSelect[swOption[0]] || [];
  
    const filteredPackages = packageList.filter((pkg) => {
      if (pkg.value === 'TheH') {
        return (
          swOption.includes('SignatureMolding') &&
          isGasolineAndValidGrade
        );
      }
      return true;
    });
  
    return (
      <>
        <br />
        <h5>패키지 옵션 선택</h5>
        <CheckboxGroup
          label="패키지를 선택해주세요."
          orientation="horizontal"
          value={selectedPackage}
          onChange={(selectedValues) => setSelectedPackage(selectedValues.slice(0, 1))} // 단일 선택
        >
          {filteredPackages.map((pkg) => (
            <div key={pkg.value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
              <Checkbox value={pkg.value}>
                {pkg.name} (+{pkg.price.toLocaleString()} 원)
              </Checkbox>
              <img
                src={`/image/${pkg.value}.png`} // 예: 패키지의 이미지 경로
                alt={pkg.name}
                style={{ width: '550px', height: '250px', objectFit: 'contain', marginTop: '10px', display: 'block' }}
              />
            </div>
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
        customerPhone={customerPhone}
        setCustomerName={setCustomerName}
        setCustomerPhone={setCustomerPhone}
      />
      <br />
      <Engine />
      {Warning && <p style={{ color: 'red' }}>엔진을 먼저 선택해주세요.</p>}
      <br />
      <CarGrade />
      <br />
      <CarColor />
      <br />
      <CarSheet />
      <br />
      <CarOptions />
      <br />
      <SWOptions />
      <br />
      <br />
      <h5>총 금액: {carPrice.toLocaleString()} 원</h5>
    </section>
  );
}