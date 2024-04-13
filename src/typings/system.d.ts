/** 请求的相关类型 */

declare namespace Service {
  /**
   * 请求的错误类型：
   * - axios: axios错误：网络错误, 请求超时, 默认的兜底错误
   * - http: 请求成功，响应的http状态码非200的错误
   * - backend: 请求成功，响应的http状态码为200，由后端定义的业务错误
   */
  type RequestErrorType = "axios" | "http" | "backend";

  /** 请求错误 */
  interface RequestError {
    /** 请求服务的错误类型 */
    type: RequestErrorType;
    /** 错误码 */
    code: string | number;
    /** 错误信息 */
    msg: string;
  }

  /** 自定义的请求成功结果 */
  interface SuccessResult<T = any> {
    /** 请求错误 */
    error: null;
    /** 请求数据 */
    data: T;
    message: string;
    code: number;
  }

  /** 自定义的请求失败结果 */
  interface FailedResult {
    /** 请求错误 */
    error: RequestError;
    /** 请求数据 */
    data: null;
    message: string;
    code: number;
  }

  /** 自定义的请求结果 */
  type RequestResult<T = any> = SuccessResult<T> | FailedResult;
}
  
declare namespace Gamedata {
  const BuildableType =  {
    'NONE': 0,
    'MELEE': 1,
    'RANGED': 2,
    'ALL': 3
  }
  interface Relic {
    id: number;
    name: string;
    description?: string;
    usage?: string;
    type: number[];              // 加攻、加伤等类别
    value: any                   // 数值，有多种不同数值：[[x, x]]，有多类数值的:[x, x] 目前仅支持手动修改
    time: number;                // 持续时间，全局生效为0， 目前仅含叙拉古
    max_level: number;           // 最大可叠加层数，0代表该藏品不可叠层
    count?: number;              // 存储层数变量，目前除了金酒之杯需要/5，其他都是直接乘 value
    occupation: Occupation[];    // 适用职业，0代表与职业无关
    "sub-occupation": number[];  // 适用子职业，0代表与子职业无关，1-5分别为近卫、狙击、医疗、重装、辅助
    position: number;            // 近战 or 远程 0都吃，1近战吃，2远程吃
  }
  enum Occupation {
    1 = "先锋",
    2 = "近卫",
    3 = "狙击",
    4 = "医疗",
    5 = "重装",
    6 = "辅助",
    7 = "术师",
    8 = "特种",
  }
  interface Character {
    id: String;
    name: String;
    rarity: number;
    favor: {
      atk?: number
      def?: number
    },
    maxPotentialLevel: number;
    val: Record<any, any>;
    potentialRanks: [];
    skills: [];
    talents: Record<string, Talent>;
    trait: Record<string, Trait>;
    equip: Equip[];
    profession: string;
    subProfessionId: string;
    position: string;
  }
  interface Skill {
    name: String;
    rangeId: String;
    description: String;
    skillType: String;
    durationType: String;
    spData: {
      spType: String;
      levelUpCost: any,
      maxChargeTime: number;
      spCost: number;
      initSp: number;
      increment: number;
    },
    prefabId: String;
    duration: number;
    blackboard: any;
    hasToken?: string;
  }

  interface Enemy {
    id: String;
    name: String;
    attrs: any[];
    level: String;
    tag?: string[]
  }
  interface Difficulty {
    name: String, 
    id: number, 
    desc: String, 
    difficulty?: number, 
    attrs?: {
      boss?: {atk?: number, maxHp?: number, def?: number, res?: number},
      elite?: {atk?: number, maxHp?: number, def?: number, res?: number}
    }
  }
  interface Equip {
    id: String;
    name: String;
    attrs: any[];
  }
  type Buff = Record<string, any>
  interface Talent {
    desc: String,
    name: String,
    value: any,
    token?: String,
  }
  interface Trait {
    desc: String,
    value: any,
  }
}