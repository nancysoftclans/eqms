<?php

namespace Modules\Reports\Providers;

use setasign\Fpdi\TcpdfFpdi;
class AuditReportProvider extends TcpdfFpdi
{
  public $params = array();
   private $tracking_no='';
   private $issue_no='';

   
	public function __construct($qr_data=array()){
			parent::__construct();
		$this->params = $qr_data;
}
	

	public function setImportHeader($tracking_no,$issue_no) {
        $this->tracking_no = $tracking_no;
        $this->issue_no = $issue_no;
    }
  function Header(){
			 $this->setMargins(7, 50, 7, true);
   

			/*$this->Cell(20,0,'',0,1);
		   $this->Cell(0,4,$org_info->org_name,0,1,'C');
		   $this->Cell(0,4,$org_info->location.',' .$org_info->street,0,1,'C');
		   $this->Cell(0,4,$org_info->postal_address.', '.$org_info->region_name,0,1,'C');
		   $this->Cell(0,4,$org_info->email.' : '.$org_info->website,0,1,'C');
		   $this->ln();
		   $this->Cell(0,4,'The Medicines and Allied Substances Act, 2013',0,1,'C');
		   */

		      // $this->setMargins(7, 50, 7, true);
    $this->SetFont('Times', 'B', 12);

    // Define page width for alignment calculations
    $pageWidth = $this->GetPageWidth();

    // Only add header content on the first page or if specific pages require it
    if ($this->PageNo() == 1 || $this->PageNo() > 1) {

        // Image positioning
        $logo = getcwd() . '/resources/images/logo.jpg';
        $logo = str_replace('\\', '/', $logo);
        $imageWidth = 30;
        $imageXPosition = ($pageWidth - $imageWidth) / 2;
        $this->Image($logo, $imageXPosition, 25, $imageWidth);

        // Set the position for the header text below the image
        $this->SetY(32.5); // 10 is the space between image and text; adjust as necessary

        // Left-aligned header text
        $this->SetX(10);
        $this->Cell(0, 10, 'BOMRA/QM/0O3/F02' .$this->tracking_no, 0, 0, 'L');

        // Center-aligned header text
        $centerText1 = 'Botswana Medicines Regulatory Authority';
        $centerText2 = 'Internal Audit Report';
        $centerTextWidth1 = $this->GetStringWidth($centerText1);
        $centerTextWidth2 = $this->GetStringWidth($centerText2);

        // Calculate X position for centering texts
        $centerXPosition1 = ($pageWidth - $centerTextWidth1) / 2;
        $centerXPosition2 = ($pageWidth - $centerTextWidth2) / 2;

        // Set Y position for the center-aligned texts
        $headerY = $this->GetY();

        // Center-aligned first line of header text
        $this->SetXY($centerXPosition1, $headerY);
        $this->Cell($centerTextWidth1, 2, $centerText1, 0, 1, 'C');

        // Center-aligned second line of header text
        $this->SetXY($centerXPosition2, $this->GetY());
        $this->Cell($centerTextWidth2, 2, $centerText2, 0, 1, 'C');

        // Right-aligned header text
        $rightText = 'Issue No. 2.0';
        $rightTextWidth = $this->GetStringWidth($rightText);
        $rightXPosition = $pageWidth - $rightTextWidth - 10; // 10 is the margin from the right edge

        $this->SetXY($rightXPosition, $headerY);
        $this->Cell($rightTextWidth, 10, $rightText, 0, 0, 'R');
    }else{

    }
				
	}
	function getOrganisationInfo(){
			$data = array('org_name'=>strtoupper('Zambia Medicines Regulatory Authority'), 
								'postal_address'=>'P.O. Box 31890,',
								'region_name'=>'Lusaka, Zambia',
								'email'=>'pharmacy@zamra.co.zm',
								'website'=>'www.zamra.co.zm',
								'street'=>'Off Kenneth Kaunda International Airport Road,',
								'location'=>' Plot No. 2350/M.',
								'act'=>'(The Medicines and Allied Substances Act, 2013)',
								'fax'=>'',
								'telephone'=>'+260 211 432 350, +260 211 432 351,+260 211 432 352',
								'org_acynm'=>'ZAMRA',
								'logo'=>'logo.jpg',
								
						);
			$org_info = (object)$data;
			return $org_info;
		}
  function Footer()
	{
		/*//Position at 1.5 cm from bottom
		$this->SetY(-15);
		//Arial italic 8
		$startY = $this->GetY();
								$startX = $this->GetX();
    $this->SetFont('times','',8);
     
    $this->SetLineWidth(0.3);
    $this->Line(0+30,$startY,180,$startY);
			
    $this->Cell(0,8,'Branches:Ndola, Chipata, Lvingstone, Chirundu, Nakonde, Solwezi, Kasama, Kenneth Kaunda International Airport(KKIA)',0,1,'C');
   
    
		 if ($this->page == 1) {
          $this->get_Docqrcode($this->params);
          $postion = $this->params['position'];
          $qr_code  = getcwd().'/assets/uploads/app_detail.png';
          $this->Image($qr_code,178,$postion,16);
		 }
     */
		//// $this->SetY(-90);
		  // Set the position at 15 mm from bottom
        $this->SetY(-15);

        // Set font for footer
        $this->SetFont('helvetica', 'I', 8);
    
   		 // Get the current date
    		//$currentDate = date('d-m-Y');
    		$currentDate = "10-11-2022";

   		 // Left-aligned date
   			 $this->Cell(0, 10, $currentDate, 0, 0, 'L');
   
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().' of '.$this->getAliasNbPages(), 0, 0, 'R');
		 
	}public function get_Docqrcode($params){
		$qr_code = new Ciqrcode($params);
		//get the details 
		
		$qr_code->generate($params); 
		
	 }

}