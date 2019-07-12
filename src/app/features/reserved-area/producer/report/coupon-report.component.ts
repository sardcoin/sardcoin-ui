import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {ReportService} from '../../../../shared/_services/report.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import {getFullYear} from 'ngx-bootstrap/chronos/utils/date-getters';
import {getMonth} from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-feature-reserved-area-producer-report',
  templateUrl: './coupon-report.component.html',
  styleUrls: ['./coupon-report.component.scss']
})
export class FeatureReservedAreaProducerCouponReportComponent implements OnInit, OnDestroy {

  public range = ['year', 'month', 'day'];
  public rangeSelected: string;
  public reportCoupons: any = null;
  public reportCouponsYear: any = null;
  public reportCouponsMonth: any = null;
  public reportCouponsDay: any = null;

  public reportCouponsWithBroker: any = null;
  public reportCouponsWithBrokerYear: any = null;
  public reportCouponsWithBrokerMonth: any = null;
  public reportCouponsWithBrokerDay: any = null;

  public barChart: any = null;
  public stackedColumnChart: any = null;
  public pieChart: any = null;

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
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Report', '/reserved-area/producer/report'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }
  groupBy(xs, key) {

    if (xs) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    }
  }


  ChangingRange(event?) {
    if (event) {
      this.rangeSelected = event.target.value;
    } else {
      this.rangeSelected = this.range[2];
    }
    switch (this.rangeSelected) {

      case 'year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerYear;
        break;
      }
      case  'month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerMonth;
        break;
      }
      case  'day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerDay;
        break;
      }
      case '0: year': {
        this.reportCoupons = this.reportCouponsYear;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerYear;
        break;
      }
      case  '1: month': {
        this.reportCoupons = this.reportCouponsMonth;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerMonth;
        break;
      }
      case  '2: day': {
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerDay;
        break;
      }
      default: { // year or day or month
        this.reportCoupons = this.reportCouponsDay;
        this.reportCouponsWithBroker = this.reportCouponsWithBrokerDay;
      }
    }
     this.setBarChart(this.reportCoupons, this.rangeSelected);
    this.setPieChart(this.reportCouponsWithBroker, this.rangeSelected);
    this.setStackedColumnChart(this.reportCouponsWithBroker, this.rangeSelected);




  }

  setBarChart(report, range) {
    if (range == 'year' || range == '0: year') {
      this.barChart = {
        chartType: 'Bar',
        dataTable: this.convertJsonToArrayForBar(report, range),
        options: {
          chart: {
            title: 'Grafico Coupons',
            subtitle: 'Grafico Coupons distinti in base al loro stato (attivi, venduti, consumati, scaduti) raggruppati per anno'
          }
        }
      };


    } else if (range == 'month' || range == '1: month') {
      this.barChart = {
        chartType: 'Bar',
        dataTable: this.convertJsonToArrayForBar(report, range),
        options: {
          chart: {
            title: 'Grafico Coupons',
            subtitle: 'Grafico Coupons distinti in base al loro stato ( attivi, venduti, consumati, scaduti) nell\'anno corrente'
          }
        }
      };

    } else {
      this.barChart = {
        chartType: 'Bar',
        dataTable: this.convertJsonToArrayForBar(report, range),
        options: {
          chart: {
            title: 'Grafico Coupons',
            subtitle: 'Grafico Coupons distinti in base al loro stato (attivi, venduti, consumati, scaduti) nel mese corrente'
          }
        }
      };
    }
  }

  setStackedColumnChart(report, range) {
    if (range == 'year' || range == '0: year') {
      this.stackedColumnChart = {
        chartType: 'ColumnChart',
        dataTable: this.convertJsonToArrayForColumn(report, range),
        options: {
          width: 600,
          height: 400,
          legend: { position: 'top', maxLines: 3 },
          bar: { groupWidth: '75%' },
          isStacked: true,
          title: 'Grafico incassi (euro) raggrupati per anno (incassi totali)',
        }
      };

    } else if (range == 'month' || range == '1: month') {
      this.stackedColumnChart = {
        chartType: 'ColumnChart',
        dataTable: this.convertJsonToArrayForColumn(report, range),
        options: {
          width: 600,
          height: 400,
          legend: { position: 'top', maxLines: 3 },
          bar: { groupWidth: '75%' },
          isStacked: true,
          title: 'Grafico incassi (euro) raggrupati per mesi (anno corrente)',

        }
      };

    } else {
      this.stackedColumnChart = {
        chartType: 'ColumnChart',
        dataTable: this.convertJsonToArrayForColumn(report, range),
        options: {
          width: 600,
          height: 400,
          legend: { position: 'top', maxLines: 3 },
          bar: { groupWidth: '75%' },
          isStacked: true,
          title: 'Grafico incassi (euro) raggrupati per giorni (mese corrente)',

        }
      };
    }
  }

  setPieChart(report, range) {
      this.pieChart = {
        chartType: 'PieChart',
        dataTable: this.convertJsonToArrayForPie(report, range),
        options: {
          title: 'Coupons venduti ' + this.setTitlePie(range),
          slices: {
            0: {offset: 0.3},
            1: {offset: 0.2}
          }
        }
    };

  }

  init() {


    this.reportService.getReportBrokerProducerCoupons().subscribe( couponsBroker => {
      if (couponsBroker) {
        console.log('cp for pie', couponsBroker);
        this.reportCouponsWithBrokerYear = this.groupBy(couponsBroker, 'year');
        this.reportCouponsWithBrokerMonth = this.groupBy(this.reportCouponsWithBrokerYear[getFullYear(new Date())], 'month');
        this.reportCouponsWithBrokerDay = this.groupBy(this.reportCouponsWithBrokerMonth[getMonth(new Date()) + 1], 'day');

        this.reportService.getReportProducerCoupons().subscribe(coupons => {
          console.log('cp for bar', coupons);
          if (coupons) {
            this.reportCouponsYear = this.groupBy(coupons, 'year');
            this.reportCouponsMonth = this.groupBy(this.reportCouponsYear[getFullYear(new Date())], 'month');
            this.reportCouponsDay = this.groupBy(this.reportCouponsMonth[getMonth(new Date()) + 1], 'day');
            this.ChangingRange();
          }
        });
      }
    });

  }

  convertJsonToArrayForBar(report, range) {

    console.log('reportBar', report);
    if (!report) {
      return null;
    }

    const totalArray = [];
    let singleArray = [];
    if (range == 'year' || range == '0: year') {singleArray = ['Anno', 'Attivi', 'Venduti', 'Consumati', 'scaduti']; }
    if (range == 'month' || range == '1: month') {singleArray = ['Mese', 'Attivi', 'Venduti', 'Consumati', 'scaduti']; }
    if (range == 'day' || range == '2: day' ) {singleArray = ['Giorno', 'Attivi', 'Venduti', 'Consumati', 'scaduti']; }
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
    console.log('barTotalArray', totalArray)

    return totalArray;
  }


  convertJsonToArrayForPie(report, range) {
    if (!report) {
      return null;
    }
    const totalArray = [];
    let singleArray = [];
    singleArray = ['', ''];
    totalArray.push(singleArray);
    for (const key in report) {
      let broker = '';

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          broker = arr.username == null ? 'Senza Broker' : arr.username;
          singleArray = [broker, arr.buyed.valueOf()];
          totalArray.push(singleArray);
        }

      }
    }
    return totalArray;
  }

  convertJsonToArrayForColumn(report, range) {
    console.log('reportColumn', report);
    console.log('reportBar', report);
    if (!report) {
      return null;
    }
    const totalArray = [];
    let singleArray = [];
    const arrayHeader = []
    if (report) {
      arrayHeader.push('Di:');

    }
    for (const key in report) {
      let broker = '';

      if (report.hasOwnProperty(key)) {
        for (const arr of report[key]) {
          broker = arr.username == null ? 'Senza Broker' : arr.username;
          arrayHeader.push(broker);
        }
      }
    }
    totalArray.push(arrayHeader);
    for (const key in report) {
      singleArray.push(this.convertMonth(key.valueOf()))
      for (let i = 1; i < arrayHeader.length; i++) {
        singleArray.push(0);
      }
      if (report.hasOwnProperty(key)) {


        for (let i = 0; i < report[key].length; i++) {
              const username = report[key][i].username;
               const receipt = report[key][i].receipt;

          for (let j = 0; j < arrayHeader.length; j++) {
                console.log('i', i, 'report[key][i].username', username, 'j', j,  'arrayHeader[j]', arrayHeader[j])
                  if (username == arrayHeader[j] || (username == null && arrayHeader[j] == 'Senza Broker')) {

                    singleArray[j] = receipt;
                  }
              }
        }

      }
      totalArray.push(singleArray);
      singleArray = [];
    }
    return totalArray;
  }

  setTitlePie(range) {

    if (range == 'year' || range == '0: year') {return ' totali'; }
    if (range == 'month' || range == '1: month') {return ' nell\' anno';  }
    if (range == 'day' || range == '2: day' ) {return ' nel mese';  }

  }

  translate(item) {
    switch (item) {

      case 'year': return 'anni';
      case  'month': return 'mesi';
      case 'day': return 'giorni';

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
}
