<?php

namespace Modules\Reports\Providers;

use setasign\Fpdi\TcpdfFpdi;
class PdfProvider extends TcpdfFpdi
{
  public $params = array();
	public function __construct($qr_data=array()){
			parent::__construct();
		$this->params = $qr_data;
		
	}
  function Header(){
   $this->setMargins(7,25,10,true);
  
	//
						$org_info = $this->getOrganisationInfo();
				$logo = getcwd() . '/resources/images/logo.jpg';
		 	//$this->Image($logo,65,20,80,33);
				$this->Image($logo,85,25,43,19);
		 
	//	}
	}

 public function Footer()
    {
        // Set the position at 15 mm from bottom
        $this->SetY(-23);

        // Set font for footer
        $this->SetFont('helvetica', 'I', 8);
    
   		 // Get the current date
    		$currentDate = date('d-m-Y');

   		 // Left-aligned date
   			 $this->Cell(0, 10, $currentDate, 0, 0, 'L');
   
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().' of '.$this->getAliasNbPages(), 0, 0, 'R');
    }


	public function get_Docqrcode($params){
		$qr_code = new Ciqrcode($params);
		//get the details 
		
		$qr_code->generate($params); 
		
	 }
function getOrganisationInfo(){
			
						$org_info = getSingleRecord('tra_organisation_information', array('id'=>1));
			
			return $org_info;
		}
}