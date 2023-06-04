/**
 * @name          QKImage
 * @description   更简单方便的前端图片操作
 * @version       1.0.0
 * @author        QuKin <13606184008@163.com>
 * @Date          2023-6-4 19:31:16
 */

"use strict";

/**
 * @class QKImage
 */
class QKImage {
    /**
     * 构造函数
     * @param {File} file
     */
    constructor(file) {
        if (!!file) {
            this.file = file;
            this.quality = 0.7;
            this.qualityTemp = 0.1;
            this.sizeArrs = [];
            this.count = 0;
            this.type = 'image/jpeg';
        }
    }

    /**
     * 设置图片文件
     * @explain 借助input的file类型，进行files[]的值
     * @param {File} file
     * @returns {QKImage}
     */
    setFile(file) {
        this.file = file;
        return this;
    }

    /**
     * 获取图片文件
     * @returns {File}
     */
    getFile() {
        return this.file;
    }

    /**
     * 设置图片质量
     * @param {number} quality min:0,max:1 ，图片质量
     * @returns {QKImage}
     */
    setQuality(quality) {
        this.quality = quality;
        return this;
    }

    /**
     * 获取图片质量
     * @returns {number}
     */
    getQuality() {
        return this.quality;
    }

    /**
     * 设置图片类型
     * @param {string} type 图片类型
     * @returns {QKImage}
     */
    setType(type) {
        this.type = type;
        return this;
    }

    /**
     * 获取图片类型
     * @returns {string}
     */
    getType() {
        return this.type;
    }

    /**
     * 设置图片的宽
     * @param {number} width 图片的宽
     * @returns {QKImage}
     */
    setWidth(width) {
        this.width = width;
        return this;
    }

    /**
     * 获取图片的宽
     * @returns {number}
     */
    getWidth() {
        return this.width;
    }

    /**
     * 设置图片的高
     * @param {number} height 图片的高
     * @returns {QKImage}
     */
    setHeight(height) {
        this.height = height;
        return this;
    }

    /**
     * 获取图片的高
     * @returns {number}
     */
    getHeight() {
        return this.height;
    }

    /**
     * 设置图片设置大小
     * @param {number} min 图片规定最小大小
     * @param {number} max 图片规定最大大小
     * @param {string} [unit=KB] 规定大小单位:B/KB/MB
     * @returns {QKImage}
     */
    setSize(min, max, unit = 'KB') {
        let temp = 1;
        switch (unit) {
            case 'KB':
                temp = 1024;
                break;
            case 'MB':
                temp = 1024 * 1024;
                break;
        }
        this.minSize = min * temp;
        this.maxSize = max * temp;
        return this;
    }

    /**
     * 获取图片设置大小
     * @returns {{minSize: number, maxSize: number}}
     */
    getSize() {
        return {
            minSize: this.minSize,
            maxSize: this.maxSize
        }
    }

    /**
     * 设置循环次数
     * @param {number} count 循环次数
     * @returns {QKImage}
     */
    setCount(count) {
        this.count = count;
        return this;
    }

    /**
     * 获取循环次数
     * @returns {number}
     */
    getCount() {
        return this.count;
    }

    /**
     * 快速设置图片宽高
     * @param {number} width 图片宽
     * @param {number} height 图片高
     * @returns {QKImage}
     */
    setWH(width, height) {
        this.width = width;
        this.height = height;
        return this;
    }

    /**
     * 获取所有值
     * @returns {{file: File, width: number, minSize: number, maxSize: number, type: string, height: number, quality: number, count: number}}
     */
    get() {
        return {
            width: this.width,
            height: this.height,
            quality: this.quality,
            file: this.file,
            type: this.type,
            minSize: this.minSize,
            maxSize: this.maxSize,
            count: this.count
        }
    }

    /**
     * 开始压缩图片
     * @param {startCallback} callBack 设置回调函数，形参是base64
     * @returns {QKImage}
     */
    start(callBack) {
        if (!!this.file) {
            let _this = this;
            // 文件读取对象
            this.reader = new FileReader();
            // 图片转base64（Blob对象或File对象）
            this.reader.readAsDataURL(this.file);
            // 读取完毕
            this.reader.onload = function () {
                // 图片转换成为base64Url
                let fileBase64 = this.result;
                // 压缩图片
                _this.photoCompress(fileBase64, callBack);
            };
        } else {
            throw new Error('没有图片')
        }
        return this;
    }

    /**
     * 回调函数
     * @callback startCallback 该函数执行完毕后，要执行的回调函数
     * @param {string} base64 base64地址
     * @param {boolean} tf 判断是否成功
     */

    /**
     * 图片压缩
     * @explain 借助canvas对图片进行重绘（canvas2DataURL）
     * @param {string} base64Url base64格式的图片字符串
     * @param {startCallback} callback 该函数执行完毕后，要执行的回调函数
     * @returns
     */
    photoCompress(base64Url, callback) {
        let _this = this;
        let img = new Image();
        img.src = base64Url;
        img.onload = function () {
            let that = this;
            // 默认按比例压缩
            let w = that.width,
                h = that.height,
                // 宽高比例
                scale = w / h;
            w = _this.width || w;
            h = _this.height || (w / scale);
            // 默认图片质量为0.7
            let quality = 0.7;
            //生成canvas
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // 创建属性节点
            let anw = document.createAttribute("width");
            anw.nodeValue = w;
            canvas.setAttributeNode(anw);
            let anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量（0-1）
            if (_this.quality && _this.quality <= 1 && _this.quality > 0) {
                quality = _this.quality;
            }
            let base64 = canvas.toDataURL(_this.type, quality);

            //canvas 转为blob并上传 (压缩后转Blob二进制对象)
            canvas.toBlob(function (blob) {
                // console.log(blob,_this.type,_this.maxSize,_this.minSize);
                if ((blob.size > _this.maxSize || blob.size < _this.minSize) && _this.count > 0 && _this.quality > 0.000001 && _this.sizeArrs.filter(item => item === blob.size).length < 5) {
                    _this.sizeArrs.push(blob.size);
                    _this.count--;

                    if (blob.size > _this.maxSize) {
                        // 当值等于0.1时qualityTemp等于0.01；当值等于0.01时qualityTemp等于0.001；依次往后
                        _this.quality = _this.amend(_this.quality, _this.qualityTemp, '-');
                        if (_this.quality === 0) {
                            _this.quality = _this.qualityTemp;
                            _this.qualityTemp = _this.amend(_this.qualityTemp, 0.1, '*');
                        }
                    } else if (blob.size < _this.minSize && (_this.quality + _this.qualityTemp) < 1) {
                        _this.quality = _this.amend(_this.quality, _this.qualityTemp, '+');
                    }

                    _this.photoCompress(base64Url, callback);
                    return false;
                } else {
                    let tf = !!_this.maxSize ? blob.size < _this.maxSize && blob.size > _this.minSize : true;
                    // 回调函数返回base64的值，并判断是否成功
                    callback(base64, tf);
                }
            }, _this.type, quality)
        };
    }

    /**
     * 小数加减乘除
     * @param {number} num1 第一位小数
     * @param {number} num2 第二位小数
     * @param {string} symbol 参数: + - * /
     * @returns {number}
     */
    amend(num1, num2, symbol) {
        /*
         * 判断obj是否为一个整数 整数取整后还是等于自己。利用这个特性来判断是否是整数
         */
        function isInteger(obj) {
            // 或者使用 Number.isInteger()
            return Math.floor(obj) === obj
        }

        /*
         * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
         * @param floatNum {number} 小数
         * @return {object}
         *   {times:100, num: 314}
         */
        function toInteger(floatNum) {
            // 初始化数字与精度 times精度倍数  num转化后的整数
            let ret = {times: 1, num: 0}
            let isNegative = floatNum < 0  //是否是小数
            if (isInteger(floatNum)) {  // 是否是整数
                ret.num = floatNum
                return ret  //是整数直接返回
            }
            let strfi = floatNum + ''  // 转换为字符串
            let dotPos = strfi.indexOf('.')
            let len = strfi.substr(dotPos + 1).length // 拿到小数点之后的位数
            let times = Math.pow(10, len)  // 精度倍数
            /* 为什么加0.5?
                前面讲过乘法也会出现精度问题
                假设传入0.16344556此时倍数为100000000
                Math.abs(0.16344556) * 100000000=0.16344556*10000000=1634455.5999999999
                少了0.0000000001
                加上0.5 0.16344556*10000000+0.5=1634456.0999999999 parseInt之后乘法的精度问题得以矫正
            */
            let intNum = parseInt(Math.abs(floatNum) * times + 0.5, 10)
            ret.times = times
            if (isNegative) {
                intNum = -intNum
            }
            ret.num = intNum
            return ret
        }

        let o1 = toInteger(num1)
        let o2 = toInteger(num2)
        let n1 = o1.num  // 3.25+3.153
        let n2 = o2.num
        let t1 = o1.times
        let t2 = o2.times
        let max = t1 > t2 ? t1 : t2
        let result = null
        switch (symbol) {
            // 加减需要根据倍数关系来处理
            case '+':
                if (t1 === t2) { // 两个小数倍数相同
                    result = n1 + n2
                } else if (t1 > t2) {
                    // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else {  // o1小数位小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max
            case '-':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max
            case '*':
                // 325*3153/(100*1000) 扩大100倍 ==>缩小100倍
                result = (n1 * n2) / (t1 * t2)
                return result
            case '/':
                // (325/3153)*(1000/100)  缩小100倍 ==>扩大100倍
                result = (n1 / n2) * (t2 / t1)
                return result
        }

    }
}