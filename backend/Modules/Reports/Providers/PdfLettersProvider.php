<?php

namespace Modules\Reports\Providers;

use setasign\Fpdi\TcpdfFpdi;
class PdfLettersProvider extends TcpdfFpdi
{
  public $params = array();
	public function __construct($qr_data=array()){
			parent::__construct();
		$this->params = $qr_data;
		
	}
  function Header(){
		$this->setMargins(7,25,7,true);
  
		if ($this->PageNo() ==1) {
						$org_info = $this->getOrganisationInfo();
				$logo = getcwd() . '/resources/images/cert_logo.png';
			$this->Image($logo,65,20,80,33);
		 
		 
		}
	}
  function Footer()
	{
		//Position at 1.5 cm from bottom
		$this->SetY(-23);
		//Arial italic 8
    $this->SetFont('times','',8);
	// $this->SetLineWidth(3);
			// $this->Line(0,67,350,67);
		$text1 = 'This document is property of the Botswana Medicines Regulatory Authority (BOMRA). It is strictly confidential and may on no account be reproduced, copied or';
		$text2 = 'divulged to any third party without prior authorization by BOMRA Management.';

		$this->Cell(0, 4, $text1, 0, 1, 'C'); // First line
		$this->Cell(0, 4, $text2, 0, 1, 'C'); // Second line
    
    /*
		 if ($this->page == 1) {
          $this->get_Docqrcode($this->params);
          $postion = $this->params['position'];
          $qr_code  = getcwd().'/assets/uploads/app_detail.png';
          $this->Image($qr_code,178,$postion,16);
		 }
     */
		 $this->SetY(-90);
		 
	}public function get_Docqrcode($params){
		$qr_code = new Ciqrcode($params);
		//get the details 
		
		$qr_code->generate($params); 
		
	 }
function getOrganisationInfo(){
			
						$org_info = getSingleRecord('tra_organisation_information', array('id'=>1));
			
			return $org_info;
		}
}