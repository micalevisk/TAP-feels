/**
*
*	@author	Micael Levi - 21554923 <mllc@icomp.ufam.edu.br>
*	@date	21 de out de 2016
*/

public class Astromech {
	// @att4
	String modelo;
	Mestre mestre;
	Sensor sensor;
	Conexao conexao;
	String getDescricao(){
		String _astromech = "Astromech modelo %s.";
		String _mestre = mestre.getDescricao();
		String _sensor = sensor.getDescricao();
		String _conexao = conexao.getDescricao();

		return String.format(_astromech + " " + _mestre + " " + _sensor + " " + _conexao, modelo);
	}

	// TODO Auto-generated constructor method.
	public Astromech(String modelo, Mestre mestre, Sensor sensor, Conexao conexao)
	{
		this.modelo = modelo;
		this.mestre = mestre;
		this.sensor = sensor;
		this.conexao = conexao;
	}
}
