// เพิ่มข้อมูล CSV เป็น constant
const SF_DATA = {
  0: { cost: 5000, success: 100, maintain: 0, degrade: 0, break: 0 },
  1: { cost: 10000, success: 95, maintain: 5, degrade: 0, break: 0 },
  2: { cost: 20000, success: 90, maintain: 10, degrade: 0, break: 0 },
  3: { cost: 35000, success: 85, maintain: 15, degrade: 0, break: 0 },
  4: { cost: 50000, success: 80, maintain: 20, degrade: 0, break: 0 },
  5: { cost: 80000, success: 75, maintain: 25, degrade: 0, break: 0 },
  6: { cost: 150000, success: 70, maintain: 30, degrade: 0, break: 0 },
  7: { cost: 200000, success: 65, maintain: 35, degrade: 0, break: 0 },
  8: { cost: 300000, success: 60, maintain: 40, degrade: 0, break: 0 },
  9: { cost: 400000, success: 55, maintain: 45, degrade: 0, break: 0 },
  10: { cost: 560000, success: 50, maintain: 35, degrade: 10, break: 5 },
  11: { cost: 640000, success: 45, maintain: 40, degrade: 10, break: 5 },
  12: { cost: 720000, success: 40, maintain: 40, degrade: 15, break: 5 },
  13: { cost: 800000, success: 35, maintain: 45, degrade: 15, break: 5 },
  14: { cost: 1200000, success: 30, maintain: 45, degrade: 20, break: 5 },
  15: { cost: 1600000, success: 25, maintain: 50, degrade: 20, break: 5 },
  16: { cost: 2000000, success: 20, maintain: 50, degrade: 25, break: 5 },
  17: { cost: 2400000, success: 15, maintain: 55, degrade: 25, break: 5 },
  18: { cost: 2800000, success: 10, maintain: 55, degrade: 30, break: 5 },
  19: { cost: 3200000, success: 5, maintain: 60, degrade: 30, break: 5 },
  20: { cost: 3600000, success: 1, maintain: 49, degrade: 40, break: 10 },
  21: { cost: 4000000, success: 1, maintain: 49, degrade: 40, break: 10 },
  22: { cost: 4800000, success: 1, maintain: 49, degrade: 40, break: 10 },
  23: { cost: 5600000, success: 1, maintain: 49, degrade: 40, break: 10 },
  24: { cost: 6400000, success: 1, maintain: 49, degrade: 40, break: 10 },
  25: { cost: 8100000, success: 1, maintain: 39, degrade: 45, break: 15 },
  26: { cost: 9000000, success: 1, maintain: 39, degrade: 45, break: 15 },
  27: { cost: 13500000, success: 1, maintain: 39, degrade: 45, break: 15 },
  28: { cost: 18000000, success: 1, maintain: 39, degrade: 45, break: 15 },
  29: { cost: 20700000, success: 1, maintain: 39, degrade: 45, break: 15 },
  30: { cost: 30000000, success: 1, maintain: 39, degrade: 45, break: 15 }
};

class StarForceSystem {
  constructor() {
    this.sfData = SF_DATA;
    this.isTopBottom = false;
    this.isStarCatch = false;
    this.starCatchBonus = false;
    this.luckyDayBonus = 0;
    this.shieldScrollActive = false;
    this.shieldingWardActive = false;
    this.mesoDiscountAmount = 0;
  }

  resetScrolls() {
    this.luckyDayBonus = 0;
    this.shieldScrollActive = false;
    this.shieldingWardActive = false;
    this.mesoDiscountAmount = 0;
  }

  toggleStarCatch() {
    this.isStarCatch = !this.isStarCatch;
    console.log('Star Catch:', this.isStarCatch ? 'ON' : 'OFF');
  }

  toggleTopBottom() {
    this.isTopBottom = !this.isTopBottom;
  }

  calculateResult(sf) {
    const data = this.sfData[sf];
    const totalBonus = (this.starCatchBonus ? 5 : 0) + this.luckyDayBonus;
    const successRate = data.success + totalBonus;

    if (successRate >= 100) {
      return { success: true, newSF: sf + 1, message: 'สำเร็จ' };
    }

    let degradeRate = this.shieldScrollActive ? 0 : data.degrade;
    let breakRate = this.shieldingWardActive ? 0 : data.break;
    let maintainRate = data.maintain;

    if (this.shieldScrollActive) {
      maintainRate += degradeRate;
    }
    if (this.shieldingWardActive) {
      maintainRate += breakRate;
    }

    const random = Math.random() * 100;
    const totalRate = successRate + maintainRate + degradeRate + (this.shieldingWardActive ? 0 : breakRate);

    const normalizedRandom = (random / 100) * totalRate;
    
    if (normalizedRandom <= successRate) {
      return {
        success: true,
        newSF: sf + 1,
        message: 'เสริมพลังสำเร็จ'
      };
    } else if (normalizedRandom <= successRate + maintainRate) {
      return {
        success: false,
        newSF: sf,
        message: 'คงสภาพเดิม'
      };
    } else if (normalizedRandom <= successRate + maintainRate + degradeRate) {
      return {
        success: false,
        newSF: sf - 1,
        message: 'ลดระดับ'
      };
    } else {
      return {
        success: false,
        newSF: sf,
        message: 'อุปกรณ์แตกหัก',
        broken: true
      };
    }
  }

  getCost(currentSF) {
    const data = this.sfData[currentSF];
    if (!data) return 0;

    const topBottomCost = data.costTopBottom || data.cost * 5;
    let finalCost = this.isTopBottom ? topBottomCost : data.cost;
    finalCost -= this.mesoDiscountAmount;
    return Math.max(0, finalCost);
  }
}

// ส่งออกคลาส
window.StarForceSystem = StarForceSystem; 