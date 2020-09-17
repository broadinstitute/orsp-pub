import { Component } from 'react';
import { button, hh, span } from 'react-hyperscript-helpers';
import LoadingWrapper from './LoadingWrapper';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";

export const ExportButton = hh(class ExportButton extends Component {

  constructor(props) {
    super(props);
  }
  
  exportPdf = (e) => () => {

    //this.props.showSpinner();
    const headerBox = document.getElementById('headerBox');
    const notesToORSP = document.getElementById('notesToORSP');
    const requestor = document.getElementById('requestor');
    const principalInvestigator = document.getElementById('principalInvestigator');
    const funding = document.getElementById('funding');
    const projectSummary = document.getElementById('projectSummary');
    const determinationQuestions = document.getElementById('determinationQuestions');

    let totalHeight = 0;
    window.scrollTo(0,0);


        html2canvas(headerBox)
        .then((canvas) => {  
          var doc = new jsPDF();
          doc = this.canvasToPdf(canvas, doc, totalHeight);
          totalHeight += this.canvasHeight(canvas, doc);
          return doc;
        })
        .then((doc) => {
          html2canvas(notesToORSP).then((canvas) => {
            doc = this.canvasToPdf(canvas, doc, totalHeight);
            if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
              totalHeight = 0;
            } 
            totalHeight += this.canvasHeight(canvas, doc);
            return doc;
          })
          .then((doc) => {
            html2canvas(requestor).then((canvas) => {
              doc = this.canvasToPdf(canvas, doc, totalHeight);
              if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
                totalHeight = 0;
              }
              totalHeight += this.canvasHeight(canvas, doc);
              return doc;
            })
            .then((doc) => {
              html2canvas(principalInvestigator).then((canvas) => {
                doc = this.canvasToPdf(canvas, doc, totalHeight);
                if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
                  totalHeight = 0;
                } 
                totalHeight += this.canvasHeight(canvas, doc);
                return doc;
              })
              .then((doc) => {
                html2canvas(funding).then((canvas) => {
                  doc = this.canvasToPdf(canvas, doc, totalHeight);
                  if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
                    totalHeight = 0;
                  } 
                  totalHeight += this.canvasHeight(canvas, doc);
                  return doc;
                })
                .then((doc) => {
                  html2canvas(projectSummary).then((canvas) => {
                    doc = this.canvasToPdf(canvas, doc, totalHeight);
                    if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
                      totalHeight = 0;
                    } 
                    totalHeight += this.canvasHeight(canvas, doc);
                    return doc;
                  })
                  .then((doc) => {
                    html2canvas(determinationQuestions).then((canvas) => {
                      
                      doc = this.canvasToPdf(canvas, doc, totalHeight);
                      doc.save('test.pdf');
                      //this.props.hideSpinner();
                    })
                  })
                })
              })
            })
          })
        });
      
       
      
  };

  canvasToPdf(canvas, doc, totalHeight ) {
    const imgData = canvas.toDataURL('image/png');

    var pageHeight = doc.internal.pageSize.getHeight() - 2;
    let ratio = this.canvasRatio(canvas, doc);

    if (canvas.height > 0) {
      if ((totalHeight + (canvas.height * ratio)) > pageHeight ) {
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, 0, canvas.width * ratio, canvas.height * ratio);
      } else {
        doc.addImage(imgData, "PNG", 0, totalHeight + 2, canvas.width * ratio, canvas.height * ratio);
      }
    }
    
    return doc;
  };

  canvasHeight(canvas, doc ) {
    return canvas.height * this.canvasRatio(canvas, doc);
  };

  canvasRatio(canvas, doc ) {
    return (doc.internal.pageSize.getWidth() - 2) / canvas.width;
  };

  render() {

    return (
      button({
        className: "btn buttonPrimary floatRight",
        style: { 'marginTop': '15px' },
        onClick: this.exportPdf()
      }, ["Export"])
    )
  }
});
export default LoadingWrapper(ExportButton, true);
