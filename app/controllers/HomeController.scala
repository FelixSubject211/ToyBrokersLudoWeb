package controllers

import de.htwg.se.toybrokersludo.aview.TUI
import de.htwg.se.toybrokersludo.controller.Controller

import javax.inject._
import play.api._
import play.api.mvc._
import de.htwg.se.toybrokersludo.model.FieldBaseImpl.Field
import de.htwg.se.toybrokersludo.model.FileIO.JsonImpl.FileIo
import play.twirl.api.Html

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  val field = new Field()
  val fileIO = new FileIo()
  val controller = new Controller(field, fileIO)
  val tui = new TUI(controller)

  def game() = Action { implicit request: Request[AnyContent] =>
    val text = controller.field.toString
    val htmlText = s"<pre>${text.replace("\n", "<br>")}</pre>"
    val html: Html = Html(htmlText)
    Ok(views.html.main(title = "Toy Brokers Ludo")(content = html))
  }

  def dice() = Action { implicit request: Request[AnyContent] =>
    controller.getShouldDice match {
      case true => {
        controller.doAndPublish(controller.dice)
        Ok(controller.getDice.toString)
      }
      case false => Conflict("Illegal state, player have to move")
    }
  }

  def getMoves() = Action { implicit request: Request[AnyContent] =>
    controller.getShouldDice match {
      case true => Conflict("Illegal state, player have to dice")
      case false => Ok(controller.getPossibleMoves(controller.getDice).toString())
    }
  }

  def move(index: Int) = Action { implicit request: Request[AnyContent] =>
    if (controller.getShouldDice) {
      Conflict("Illegal state, player have to dice")
    }
    controller.getPossibleMoves(controller.getDice).lift(index) match {
      case Some(move) => {
        controller.doAndPublish (controller.move, move )
        Ok(move.toString)
      }
      case None => Conflict("Illegal move index")
    }
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.undo)
    Ok("success")
  }

  def redo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.redo)
    Ok("success")
  }
}
