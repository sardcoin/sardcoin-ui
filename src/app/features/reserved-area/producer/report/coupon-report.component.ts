import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as _ from 'lodash';
import { getMonth } from 'ngx-bootstrap/chronos';
import { getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ReportService } from '../../../../shared/_services/report.service';

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

  loading = true;

  range = ['year', 'month', 'day'];
  rangeSelected: string;
  reportCoupons: any = null;
  reportCouponsYear: any = null;
  reportCouponsMonth: any = null;
  reportCouponsDay: any = null;

  reportCouponsWithBrokerMoney: any = null;
  reportCouponsWithBrokerYearMoney: any = null;
  reportCouponsWithBrokerMonthMoney: any = null;
  reportCouponsWithBrokerDayMoney: any = null;

  reportCouponsWithBrokerQuantity: any = null;
  reportCouponsWithBrokerYearQuantity: any = null;
  reportCouponsWithBrokerMonthQuantity: any = null;
  reportCouponsWithBrokerDayQuantity: any = null;

  reportBrokerQuantity: any = null;
  reportBrokerYearQuantity: any = null;
  reportBrokerMonthQuantity: any = null;
  reportBrokerDayQuantity: any = null;

  barChart = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Statistiche generali',
        subtitle: 'Coupon attivi, venduti, consumati e scaduti'
      },
      width: 300,
      height: 340,
      size: 9,
      responsive: true,
      maintainAspectRatio: false
    }
  };

  barChartForBoughtProducerMoney: any = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Incassi',
        subtitle: ''
      },
      width: 300,
      height: 340,
      size: 9,

    }

  };

  barChartForBoughtProducerQuantity: any = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Quantità vendute',
        subtitle: ''
      },
      width: 300,
      height: 340,
      size: 9,

    }

  };

  barChartForBoughtBrokersQuantity: any = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      legend: true,
      chart: {
        title: 'Statistiche vendita broker',
        subtitle: ''
      },
      width: 300,
      height: 340,
      size: 9,

    }

  };

  pieChart: any = {
    chartType: 'PieChart',
    dataTable: [],
    options: {
      title: 'Coupons venduti ',
      slices: {
        0: {offset: 0.3},
        1: {offset: 0.2}
      }
    }
  };

  areaDataAvailable = (): boolean =>
    this.barChart.dataTable.length > 0 &&
    this.barChartForBoughtProducerMoney.dataTable.length > 0 &&
    this.barChartForBoughtProducerQuantity.dataTable.length > 0 &&
    this.barChartForBoughtBrokersQuantity.dataTable.length > 0;

  ngOnInit() {
    this.addBreadcrumb();

  }

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private reportService: ReportService
  ) {
    this.init();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Report', '/reserved-area/producer/report'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  groupBy(xs, key) {

    if (xs) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);

        return rv;
      }, {});
    } else {
      return null;
    }
  }

  ChangingRange(event?) {
    if (event) {
      this.rangeSelected = event.target.value;
    } else {
      this.rangeSelected = this.range[0];
    }
    switch (this.rangeSelected) {

      case 'year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

        break;
      }
      case  'month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  'day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      case '0: year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

        break;
      }
      case  '1: month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  '2: day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      default: { // year or day or month
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;
        this.reportBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

      }
    }
    this.setBarChart(this.reportCoupons, this.rangeSelected);
    this.setPieChart(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerMoney(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerQuantity(this.reportCouponsWithBrokerQuantity, this.rangeSelected);
    this.setBarChartBoughtForBrokerQuantity(this.reportBrokerQuantity, this.rangeSelected);
  }

  setBarChart(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.barChart.options.chart.subtitle = 'Raggruppamento per stato e per anno';
      this.barChart = Object.create(this.barChart);

    } else if (range == 'month' || range == '1: month') {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.barChart.options.chart.subtitle = 'Raggruppamento per stato e per mese dell\'anno corrente';
      this.barChart = Object.create(this.barChart);

    } else {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      // this.barChart.options.chart.subtitle = 'Raggruppamento per stato e per giorno del mese corrente';
      this.barChart = Object.create(this.barChart);

    }
  }

  setBarChartBoughtProducerBrokerMoney(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per anno, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per mese dell\'anno corrente, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    } else {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Ricavi totali raggruppati per giorno del mese corrente, con o senza broker.';
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    }
  }

  setBarChartBoughtProducerBrokerQuantity(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per anno, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per mese dell\'anno corrente, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    } else {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Coupon venduti raggruppati per giorno del mese corrente, con o senza broker.';
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

    }

  }

  async setBarChartBoughtForBrokerQuantity(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per anno';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per mesi dell\'anno corrente';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    } else {
      this.barChartForBoughtBrokersQuantity.dataTable = await this.convertJsonToArrayForBoughtBrokerQuantity(report, range);
      this.barChartForBoughtBrokersQuantity.options.chart.subtitle = 'Quantità di coupon venduti da ogni broker, raggruppati per giorni del mese corrente';
      this.barChartForBoughtBrokersQuantity = Object.create(this.barChartForBoughtBrokersQuantity);

    }
  }

  setPieChart(report, range) {
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: [], // this.convertJsonToArrayForPie(report, range) da mettere
      options: {
        title: 'Coupons venduti ' + this.setTitlePie(range),
        slices: {
          0: {offset: 0.3},
          1: {offset: 0.2}
        }
      }
    };
    this.pieChart = Object.create(this.pieChart);

  }

  init() {

    this.reportService.getReportBoughtProducerCoupons().subscribe(couponsBougth => {
      if (couponsBougth) {
        this.reportCouponsWithBrokerYearMoney = _.groupBy(couponsBougth, 'year');
        this.reportCouponsWithBrokerYearQuantity = _.groupBy(couponsBougth, 'year');

        if (this.reportCouponsWithBrokerYearMoney) {
          this.reportCouponsWithBrokerMonthMoney = _.groupBy(this.reportCouponsWithBrokerYearMoney[getFullYear(new Date())], 'month');
          this.reportCouponsWithBrokerMonthQuantity = _.groupBy(this.reportCouponsWithBrokerYearQuantity[getFullYear(new Date())], 'month');

          if (this.reportCouponsWithBrokerMonthMoney) {
            this.reportCouponsWithBrokerDayMoney = _.groupBy(this.reportCouponsWithBrokerMonthMoney[getMonth(new Date()) + 1], 'day');
            this.reportCouponsWithBrokerDayQuantity = _.groupBy(this.reportCouponsWithBrokerMonthQuantity[getFullYear(new Date())], 'month');

          }
        }

        this.reportService.getReportProducerCoupons().subscribe(coupons => {
          if (coupons) {
            this.reportCouponsYear = this.groupBy(coupons, 'year');
            if (this.reportCouponsYear) {
              this.reportCouponsMonth = this.groupBy(this.reportCouponsYear[getFullYear(new Date())], 'month');
              if (this.reportCouponsMonth) {
                this.reportCouponsDay = this.groupBy(this.reportCouponsMonth[getMonth(new Date()) + 1], 'day');
              }
            }
          }
          this.loading = false;
          this.ChangingRange();
        });
      } else {
        this.loading = false;
      }
    });

  }

  convertJsonToArrayForBar(report, range) {

    if (!report) {
      return [];
    }

    const totalArray = [];
    let singleArray = [];
    singleArray = ['', 'Attivi', 'Venduti', 'Consumati', 'Scaduti'];
    totalArray.push(singleArray);
    for (const key in report) {
      let active = 0;
      let buyed = 0;
      let generated = 0;
      let verify = 0;
      let expired = 0;

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          active += arr.active;
          buyed += arr.bougth;
          generated += arr.generated;
          verify += arr.verify;
          expired += arr.expired;
        }
        singleArray = [this.convertDate(key.valueOf()), active.valueOf(), buyed.valueOf(), verify.valueOf(), expired.valueOf()];
        totalArray.push(singleArray);
      }
    }
    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  convertJsonToArrayForPie(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [];
    singleArray = ['', ''];
    totalArray.push(singleArray);
    for (const key in report) {
      let broker = '';

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          broker = arr.username == undefined ? 'Senza Broker' : arr.username;
          singleArray = [broker, arr.buyed.valueOf()];
          totalArray.push(singleArray);
        }

      }
    }

    return totalArray;
  }

  convertJsonToArrayForBoughtProducerMoney(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : '',
      'Senza Broker', 'Con Broker'];
    totalArray.push(singleArray);
    const arrayHeader = [];

    for (const key in report) {
      let totalWithBroker = 0;
      let totalWithoutBroker = 0;

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            totalWithBroker += (arr.price * arr.bought);
          } else {

            totalWithoutBroker += (arr.price * arr.bought);
          }
        }

        singleArray = [this.convertDate(key.valueOf()), totalWithoutBroker,
          totalWithBroker];
        totalArray.push(singleArray);

      }
    }
    // totalArray.push(arrayHeader);
    // for (const key in report) {
    //   singleArray.push(key);
    //   console.log('key', key)
    //   // singleArray.push(this.convertDate(key.valueOf())); for month
    //
    //   for (let i = 1; i < arrayHeader.length; i++) {
    //     singleArray.push('0');
    //   }
    //   if (report.hasOwnProperty(key)) {
    //
    //     for (let i = 0; i < report[key].length; i++) {
    //           const pack = report[key][i].package;
    //           const receipt = report[key][i].price;
    //
    //           for (let j = 0; j < arrayHeader.length; j++) {
    //             // console.log('i', i, 'report[key][i].username', pack, 'j', j,  'arrayHeader[j]', arrayHeader[j]);
    //             if (pack ) {
    //
    //                 singleArray[j] = receipt;
    //               } else {
    //               singleArray[j] = receipt;
    //
    //             }
    //           }
    //     }
    //
    //   }
    //   totalArray.push(singleArray);
    //   singleArray = [];
    // }
    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  async convertJsonToArrayForBoughtBrokerQuantity(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    const singleArrayHeader = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : ''];
    for (const key in report) {
      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            const br = await this.reportService.getBrokerFromCouponId(arr.coupon_id).toPromise();
            if (br) {
              if (singleArrayHeader.indexOf(br.username) === -1) {
                singleArrayHeader.push(br.username);
                // singleArray.push(arr.bought);
              }
            }
          }
        }
      }
    }
    totalArray.push(singleArrayHeader);
    let arrayData = [];
    for (const i of singleArrayHeader) {
      arrayData.push(0);
    }
    const singleArray = arrayData;
    for (const key in report) {
      arrayData[0] = this.convertDate(key.valueOf());

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package !== null) {
            const br = await this.reportService.getBrokerFromCouponId(arr.coupon_id).toPromise();
            if (br) {
              if (arrayData[singleArrayHeader.indexOf(br.username)] == 0) {
                arrayData[singleArrayHeader.indexOf(br.username)] = arr.bought;
              } else {
                const actual = Number(arrayData[singleArrayHeader.indexOf(br.username)]);
                const now = Number(arr.bought);
                const current = actual + now;
                arrayData[singleArrayHeader.indexOf(br.username)] = current;
              }
            }
          }
        }
        totalArray.push(arrayData);
        arrayData = [];
        for (const i of singleArrayHeader) {
          arrayData.push(0);
        }
      }

    }

    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  convertJsonToArrayForBoughtProducerQuantity(report, range) {
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      '' : range == 'month' || range == '1: month' ?
        '' : '', 'Senza Broker', 'Con Broker'];
    totalArray.push(singleArray);
    const arrayHeader = [];

    for (const key in report) {
      let totalWithBroker = 0;
      let totalWithoutBroker = 0;

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          if (arr.package) {
            totalWithBroker += arr.bought;
          } else {

            totalWithoutBroker += arr.bought;
          }
        }

        singleArray = [this.convertDate(key.valueOf()), totalWithoutBroker,
          totalWithBroker];
        totalArray.push(singleArray);

      }
    }

    if (totalArray.length == 1) {
      return [['', 'Nessun Valore'], ['Nessun valore da visualizzare', 0]];
    }

    return totalArray;
  }

  setTitlePie(range) {

    if (range == 'year' || range == '0: year') {
      return ' totali';
    }
    if (range == 'month' || range == '1: month') {
      return ' nell\' anno';
    }
    if (range == 'day' || range == '2: day') {
      return ' nel mese';
    }

  }

  translate(item) {
    switch (item) {

      case 'year':
        return 'Tutti i coupon';
      case  'month':
        return 'Anno corrente';
      case 'day':
        return 'Mese corrente';

    }
  }

  convertDate(range) {
    if (this.reportCoupons == this.reportCouponsMonth) {
      switch (Number(range)) {
        case 1:
          return 'Gennaio';
        case 2:
          return 'Febbraio';
        case 3:
          return 'Marzo';
        case 4:
          return 'Aprile';
        case 5:
          return 'Maggio';
        case 6:
          return 'Giugno';
        case 7:
          return 'Luglio';
        case 8:
          return 'Agosto';
        case 9:
          return 'Settembre';
        case 10:
          return 'Ottobre';
        case 11:
          return 'Novembre';
        case 12:
          return 'Dicembre';

      }
    } else {
      return range;
    }
  }


  /*
    @HostListener('window:resize', ['$event'])
    onWindowResize = (event: any) => {
      if (event.target.innerWidth >= 1300) {
        this.barChart.options.width = 400;
        this.barChart.options.height = 300;
      } else {
        this.barChart.options.width = 300;
        this.barChart.options.height = 300;
      }
      this.barChart.component.draw();

      // this.barChart1.draw();
      // you can remove two lines that preserve selection if you don't need them
    };*/


}
