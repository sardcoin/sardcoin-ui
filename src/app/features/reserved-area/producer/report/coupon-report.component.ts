import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { getMonth } from 'ngx-bootstrap/chronos';
import { getFullYear } from 'ngx-bootstrap/chronos/utils/date-getters';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ReportService } from '../../../../shared/_services/report.service';
import * as _ from 'lodash';
import { ChartErrorEvent } from 'ng2-google-charts';

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

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

  barChart: any  = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      chart: {
        title: 'Grafico Coupons',
        subtitle: 'Grafico Coupons distinti in base al loro stato ( attivi, venduti, consumati, scaduti)'
      },
      width: 510,
      height: 340
    }
  };

  barChartForBoughtProducerMoney: any = {
      chartType: 'Bar',
      dataTable: [],
      options: {
        chart: {
          title: 'Grafico incassi (euro)',
          subtitle: ''
        },
        width: 510,
        height: 340
      }

    }

  barChartForBoughtProducerQuantity: any = {
    chartType: 'Bar',
    dataTable: [],
    options: {
      chart: {
        title: 'Grafico Coupons venduti',
        subtitle: ''
      },
      width: 510,
      height: 340
    }

  }

  pieChart: any  = {
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

        break;
      }
      case  'month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  'day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      case '0: year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerYearMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerYearQuantity;

        break;
      }
      case  '1: month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerMonthMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerMonthQuantity;

        break;
      }
      case  '2: day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

        break;
      }
      default: { // year or day or month
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBrokerMoney = this.reportCouponsWithBrokerDayMoney;
        this.reportCouponsWithBrokerQuantity = this.reportCouponsWithBrokerDayQuantity;

      }
    }
    this.setBarChart(this.reportCoupons, this.rangeSelected);
    this.setPieChart(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerMoney(this.reportCouponsWithBrokerMoney, this.rangeSelected);
    this.setBarChartBoughtProducerBrokerQuantity(this.reportCouponsWithBrokerQuantity, this.rangeSelected);


    }

    setBarChart(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      this.barChart.options.chart.subtitle = 'Grafico Coupons distinti in base al loro stato (attivi, venduti, consumati, scaduti) raggruppati per anno';
      this.barChart = Object.create(this.barChart);

    } else if (range == 'month' || range == '1: month') {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      this.barChart.options.chart.subtitle = 'Grafico Coupons distinti in base al loro stato (attivi, venduti, consumati, scaduti) raggruppati per mese (anno corrente)';
      this.barChart = Object.create(this.barChart);

    } else {
      this.barChart.dataTable = this.convertJsonToArrayForBar(report, range);
      this.barChart.options.chart.subtitle = 'Grafico Coupons distinti in base al loro stato (attivi, venduti, consumati, scaduti) raggruppati per giorno (mese corrente)';
      this.barChart = Object.create(this.barChart);

    }
  }

    setBarChartBoughtProducerBrokerMoney(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Grafico incassi (euro) raggruppati per anno (incassi totali)'
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);


    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Grafico incassi (euro) raggruppati per mese (incassi anno corrente)'
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);


    } else {
      this.barChartForBoughtProducerMoney.dataTable = this.convertJsonToArrayForBoughtProducerMoney(report, range);
      this.barChartForBoughtProducerMoney.options.chart.subtitle = 'Grafico incassi (euro) raggruppati per giorno (incassi mese corrente)'
      this.barChartForBoughtProducerMoney = Object.create(this.barChartForBoughtProducerMoney);

    }
  }
  setBarChartBoughtProducerBrokerQuantity(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Grafico quantità Coupons venduti raggruppati per anno (coupons totali)'
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);


    } else if (range == 'month' || range == '1: month') {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Grafico quantità Coupons venduti raggruppati per mese (coupons anno corrente)'
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);


    } else {
      this.barChartForBoughtProducerQuantity.dataTable = this.convertJsonToArrayForBoughtProducerQuantity(report, range);
      this.barChartForBoughtProducerQuantity.options.chart.subtitle = 'Grafico quantità Coupons venduti raggruppati per giorno (coupons mese corrente)'
      this.barChartForBoughtProducerQuantity = Object.create(this.barChartForBoughtProducerQuantity);

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
        console.log('getReportBougthProducerCoupons', couponsBougth);
        if (couponsBougth) {
          this.reportCouponsWithBrokerYearMoney = _.groupBy(couponsBougth, 'year');
          this.reportCouponsWithBrokerYearQuantity = _.groupBy(couponsBougth, 'year');

          console.log('this.reportCouponsWithBrokerYearMoney', this.reportCouponsWithBrokerYearMoney);

          if (this.reportCouponsWithBrokerYearMoney) {
            this.reportCouponsWithBrokerMonthMoney = _.groupBy(this.reportCouponsWithBrokerYearMoney[getFullYear(new Date())], 'month');
            this.reportCouponsWithBrokerMonthQuantity = _.groupBy(this.reportCouponsWithBrokerYearQuantity[getFullYear(new Date())], 'month');
            console.log('this.reportCouponsWithBrokerMonthMoney', this.reportCouponsWithBrokerMonthMoney);

            if (this.reportCouponsWithBrokerMonthMoney) {
              this.reportCouponsWithBrokerDayMoney = _.groupBy(this.reportCouponsWithBrokerMonthMoney[getMonth(new Date()) + 1], 'day');
              this.reportCouponsWithBrokerDayQuantity = _.groupBy(this.reportCouponsWithBrokerMonthQuantity[getFullYear(new Date())], 'month');
              console.log('this.reportCouponsWithBrokerDayMoney', this.reportCouponsWithBrokerDayMoney);

            }
          }
        }

        this.reportService.getReportProducerCoupons().subscribe(coupons => {
          console.log('getReportProducerCoupons', coupons);
          if (coupons) {
            this.reportCouponsYear = this.groupBy(coupons, 'year');
            if (this.reportCouponsYear) {
              this.reportCouponsMonth = this.groupBy(this.reportCouponsYear[getFullYear(new Date())], 'month');
              if (this.reportCouponsMonth) {
                this.reportCouponsDay = this.groupBy(this.reportCouponsMonth[getMonth(new Date()) + 1], 'day');
              }
            }

          console.log();
          }
          this.ChangingRange();
        });
      }
    });

  }

    convertJsonToArrayForBar(report, range) {

    console.log('reportBar', report);
    if (!report) {
      return [];
    }

    const totalArray = [];
    let singleArray = [];
    singleArray = ['Anno', 'Attivi', 'Venduti', 'Consumati', 'scaduti'];
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
          buyed += arr.buyed;
          generated += arr.generated;
          verify += arr.verify;
          expired += arr.expired;
        }
        singleArray = [this.convertMonth(key.valueOf()), active.valueOf(),
                       buyed.valueOf() , verify.valueOf(), expired.valueOf()];
        totalArray.push(singleArray);
      }
    }
    console.log('barTotalArray', totalArray);
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
    console.log('range', range);
      if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      'Anno' : range == 'month' || range == '1: month' ?
        'mese' : 'giorno',
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

        singleArray = [this.convertMonth(key.valueOf()), totalWithoutBroker,
                       totalWithBroker]
        totalArray.push(singleArray);

      }
    }
    // totalArray.push(arrayHeader);
    // for (const key in report) {
    //   singleArray.push(key);
    //   console.log('key', key)
    //   // singleArray.push(this.convertMonth(key.valueOf())); for month
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
      return [['', 'Nessun Valore'], [ 'Nessun valore da visualizzare', 0]];
      }
    return totalArray;
  }

  convertJsonToArrayForBoughtProducerQuantity(report, range) {
    console.log('range', range);
    if (!report) {
      return [];
    }
    const totalArray = [];
    let singleArray = [range == 'year' || range == '0: year' ?
      'Anno' : range == 'month' || range == '1: month' ?
        'mese' : 'giorno',
      'Senza Broker', 'Con Broker'];
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

        singleArray = [this.convertMonth(key.valueOf()), totalWithoutBroker,
          totalWithBroker]
        totalArray.push(singleArray);

      }
    }
    // totalArray.push(arrayHeader);
    // for (const key in report) {
    //   singleArray.push(key);
    //   console.log('key', key)
    //   // singleArray.push(this.convertMonth(key.valueOf())); for month
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
      return [['', 'Nessun Valore'], [ 'Nessun valore da visualizzare', 0]];
    }
    return totalArray;
  }

    setTitlePie(range) {

    if (range == 'year' || range == '0: year') {return ' totali'; }
    if (range == 'month' || range == '1: month') {return ' nell\' anno';  }
    if (range == 'day' || range == '2: day') {return ' nel mese';  }

  }

    translate(item) {
    switch (item) {

      case 'year': return 'Analisi Coupons dalla data di inizio a oggi';
      case  'month': return 'Analisi Coupons nell\'anno corrente';
      case 'day': return 'Analisi Coupons nel mese corrente';

    }
  }

    convertMonth(range) {
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
};
